import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { pool, withTransaction } from '@/lib/db';
import mongoose from 'mongoose';
import Bet from '@models/Bet';

// Connect to MongoDB for the Bet model
// This assumes you have a MONGODB_URI in your environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/betpal';

let isConnected = false;

// Initialize Mongoose connection
async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// GET handler - Fetch bets
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    
    // SQL version
    let query = 'SELECT * FROM bets WHERE 1=1';
    const params: any[] = [];
    
    if (userId) {
      query += ' AND (creator_id = $1 OR opponent_id = $1)';
      params.push(userId);
    }
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (category) {
      query += ` AND category_id = $${params.length + 1}`;
      params.push(parseInt(category));
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    // Get additional data from MongoDB for rich content (comments, evidence, etc.)
    await connectToDatabase();
    
    // For each bet, fetch additional data from MongoDB if needed
    for (const bet of result.rows) {
      try {
        const mongooseBet = await Bet.findOne({ 'creator.userId': bet.creator_id, title: bet.title });
        if (mongooseBet) {
          bet.comments = mongooseBet.comments;
          bet.evidence = mongooseBet.evidence;
          bet.participants = mongooseBet.participants;
        }
      } catch (error) {
        console.error('Error fetching MongoDB data for bet:', error);
        // Continue even if MongoDB fetch fails
      }
    }
    
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error('Error fetching bets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - Create new bet
export async function POST(req: Request) {
  try {
    const betData = await req.json();
    const {
      title,
      description,
      creatorId,
      opponentId,
      categoryId,
      stake,
      monetaryStake,
      deadline,
      privacy = 'friends',
      isMonetary = false
    } = betData;
    
    if (!title || !creatorId || !stake || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create bet in PostgreSQL using a transaction
    const result = await withTransaction(async (client) => {
      const betId = uuidv4();
      
      // Insert into PostgreSQL
      const sqlResult = await client.query(
        `INSERT INTO bets 
          (bet_id, title, description, creator_id, opponent_id, category_id, stake, monetary_stake, 
           deadline, created_at, updated_at, status, privacy, is_monetary) 
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10, $11, $12) 
         RETURNING *`,
        [
          betId,
          title,
          description,
          creatorId,
          opponentId || null,
          categoryId || null,
          stake,
          monetaryStake || null,
          new Date(deadline),
          'pending',
          privacy,
          isMonetary
        ]
      );
      
      // Create bet participants
      await client.query(
        `INSERT INTO bet_participants (bet_id, user_id, participant_type, joined_at)
         VALUES ($1, $2, 'creator', NOW())`,
        [betId, creatorId]
      );
      
      if (opponentId) {
        await client.query(
          `INSERT INTO bet_participants (bet_id, user_id, participant_type, joined_at)
           VALUES ($1, $2, 'opponent', NOW())`,
          [betId, opponentId]
        );
      }
      
      // Create activity feed item
      await client.query(
        `INSERT INTO activity_feed 
          (user_id, activity_type, target_id, target_type, content, created_at, privacy)
         VALUES 
          ($1, 'created_bet', $2, 'bet', $3, NOW(), $4)`,
        [creatorId, betId, `created a new bet: "${title}"`, privacy]
      );
      
      // Create notification for opponent
      if (opponentId) {
        await client.query(
          `INSERT INTO notifications 
            (user_id, type, title, message, related_id, is_read, created_at)
           VALUES 
            ($1, 'bet_request', 'New Bet Request', $2, $3, false, NOW())`,
          [opponentId, `${title} - ${stake}`, betId]
        );
      }
      
      return sqlResult.rows[0];
    });

    // Create rich document in MongoDB (optional, but good for comments, evidence, etc.)
    await connectToDatabase();
    
    // Create creator user info
    const creatorQuery = await pool.query(
      'SELECT username FROM users WHERE user_id = $1',
      [creatorId]
    );
    
    const creatorUsername = creatorQuery.rows[0]?.username || 'Unknown User';
    
    // Create opponent user info if available
    let opponentUsername = null;
    if (opponentId) {
      const opponentQuery = await pool.query(
        'SELECT username FROM users WHERE user_id = $1',
        [opponentId]
      );
      opponentUsername = opponentQuery.rows[0]?.username || 'Unknown User';
    }
    
    // Create category info if available
    let categoryName = null;
    if (categoryId) {
      const categoryQuery = await pool.query(
        'SELECT name FROM categories WHERE category_id = $1',
        [categoryId]
      );
      categoryName = categoryQuery.rows[0]?.name || null;
    }
    
    // Create the MongoDB document for rich content
    const mongoBet = new Bet({
      title,
      description,
      creator: {
        userId: creatorId,
        username: creatorUsername
      },
      opponent: opponentId ? {
        userId: opponentId,
        username: opponentUsername
      } : null,
      category: categoryId ? {
        categoryId,
        name: categoryName
      } : null,
      stake,
      monetaryStake: isMonetary ? {
        amount: monetaryStake,
        currency: 'USD'
      } : null,
      deadline: new Date(deadline),
      status: 'pending',
      privacy,
      isMonetary,
      participants: [
        {
          userId: creatorId,
          username: creatorUsername,
          participantType: 'creator',
          joinedAt: new Date()
        },
        ...(opponentId ? [{
          userId: opponentId,
          username: opponentUsername,
          participantType: 'opponent',
          joinedAt: new Date()
        }] : [])
      ]
    });
    
    await mongoBet.save();
    
    // Return the created bet
    return NextResponse.json({
      message: 'Bet created successfully',
      bet: {
        ...result,
        mongoBetId: mongoBet._id
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating bet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler - Update bet
export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const betId = url.searchParams.get('id');
    const updateData = await req.json();
    
    if (!betId) {
      return NextResponse.json(
        { error: 'Bet ID is required' },
        { status: 400 }
      );
    }

    // Handle various update types
    const { type, userId, status, outcome, evidence, comment, vote } = updateData;
    
    // Ensure user has permission to update this bet
    const betCheck = await pool.query(
      'SELECT * FROM bets WHERE bet_id = $1',
      [betId]
    );
    
    if (betCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Bet not found' },
        { status: 404 }
      );
    }
    
    const bet = betCheck.rows[0];
    
    // For certain actions, ensure the user is the creator or opponent
    if (['status', 'outcome'].includes(type) && 
        userId !== bet.creator_id && 
        userId !== bet.opponent_id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this bet' },
        { status: 403 }
      );
    }
    
    // Handle different update types
    switch (type) {
      case 'status':
        // Update bet status
        await pool.query(
          'UPDATE bets SET status = $1, updated_at = NOW() WHERE bet_id = $2',
          [status, betId]
        );
        
        // Update MongoDB status
        await connectToDatabase();
        await Bet.findOneAndUpdate(
          { 'creator.userId': bet.creator_id, title: bet.title },
          { status }
        );
        
        // Create notification for the other user
        const otherUserId = userId === bet.creator_id ? bet.opponent_id : bet.creator_id;
        
        if (otherUserId) {
          const statusMessages = {
            'active': 'accepted your bet',
            'canceled': 'canceled the bet',
            'disputed': 'disputed the bet outcome'
          };
          
          await pool.query(
            `INSERT INTO notifications 
              (user_id, type, title, message, related_id, is_read, created_at)
             VALUES 
              ($1, 'bet_status', 'Bet Status Updated', $2, $3, false, NOW())`,
            [otherUserId, `Bet "${bet.title}" has been ${status}`, betId]
          );
          
          // Also create activity feed item
          await pool.query(
            `INSERT INTO activity_feed 
              (user_id, activity_type, target_id, target_type, content, created_at, privacy)
             VALUES 
              ($1, 'updated_bet', $2, 'bet', $3, NOW(), $4)`,
            [userId, betId, statusMessages[status] || `updated the bet status to ${status}`, bet.privacy]
          );
        }
        break;
        
      case 'outcome':
        // Update bet outcome and status
        await pool.query(
          'UPDATE bets SET outcome = $1, status = $2, updated_at = NOW() WHERE bet_id = $3',
          [outcome, 'completed', betId]
        );
        
        // Handle user stats updates based on outcome
        await handleOutcomeStats(bet, outcome);
        
        // Update MongoDB
        await connectToDatabase();
        await Bet.findOneAndUpdate(
          { 'creator.userId': bet.creator_id, title: bet.title },
          { outcome, status: 'completed' }
        );
        
        // Create notifications and activity
        const winnerUserId = outcome === 'win_creator' ? bet.creator_id : bet.opponent_id;
        const loserUserId = outcome === 'win_creator' ? bet.opponent_id : bet.creator_id;
        
        if (winnerUserId && loserUserId) {
          // Notify winner
          await pool.query(
            `INSERT INTO notifications 
              (user_id, type, title, message, related_id, is_read, created_at)
             VALUES 
              ($1, 'win', 'You Won a Bet!', $2, $3, false, NOW())`,
            [winnerUserId, `You won your bet "${bet.title}" (${bet.stake})`, betId]
          );
          
          // Notify loser
          await pool.query(
            `INSERT INTO notifications 
              (user_id, type, title, message, related_id, is_read, created_at)
             VALUES 
              ($1, 'loss', 'Bet Result', $2, $3, false, NOW())`,
            [loserUserId, `You lost your bet "${bet.title}" (${bet.stake})`, betId]
          );
          
          // Activity feed
          await pool.query(
            `INSERT INTO activity_feed 
              (user_id, activity_type, target_id, target_type, content, created_at, privacy)
             VALUES 
              ($1, 'won_bet', $2, 'bet', $3, NOW(), $4)`,
            [winnerUserId, betId, `won a bet against ${loserUserId === bet.creator_id ? 'creator' : 'opponent'}`, bet.privacy]
          );
        }
        break;
        
      case 'evidence':
        // Add evidence in MongoDB
        await connectToDatabase();
        
        const { evidenceType, content } = evidence;
        if (!evidenceType || !content) {
          return NextResponse.json(
            { error: 'Evidence type and content are required' },
            { status: 400 }
          );
        }
        
        // Get username
        const userQuery = await pool.query(
          'SELECT username FROM users WHERE user_id = $1',
          [userId]
        );
        const username = userQuery.rows[0]?.username || 'Unknown User';
        
        // Add evidence to MongoDB document
        await Bet.findOneAndUpdate(
          { 'creator.userId': bet.creator_id, title: bet.title },
          { 
            $push: { 
              evidence: {
                userId,
                username,
                evidenceType,
                content,
                submittedAt: new Date()
              } 
            } 
          }
        );
        
        // Create notification for the other user
        const evidenceNotifyUserId = userId === bet.creator_id ? bet.opponent_id : bet.creator_id;
        
        if (evidenceNotifyUserId) {
          await pool.query(
            `INSERT INTO notifications 
              (user_id, type, title, message, related_id, is_read, created_at)
             VALUES 
              ($1, 'evidence', 'New Evidence Added', $2, $3, false, NOW())`,
            [evidenceNotifyUserId, `New evidence was added to "${bet.title}"`, betId]
          );
        }
        break;
        
      case 'comment':
        // Add comment in MongoDB
        await connectToDatabase();
        
        const { content: commentContent, parentId } = comment;
        if (!commentContent) {
          return NextResponse.json(
            { error: 'Comment content is required' },
            { status: 400 }
          );
        }
        
        // Get username
        const commentUserQuery = await pool.query(
          'SELECT username FROM users WHERE user_id = $1',
          [userId]
        );
        const commentUsername = commentUserQuery.rows[0]?.username || 'Unknown User';
        
        // Add comment to MongoDB document
        await Bet.findOneAndUpdate(
          { 'creator.userId': bet.creator_id, title: bet.title },
          { 
            $push: { 
              comments: {
                userId,
                username: commentUsername,
                content: commentContent,
                parentId: parentId || null,
                createdAt: new Date(),
                updatedAt: new Date()
              } 
            } 
          }
        );
        break;
        
      case 'vote':
        // Add vote in MongoDB for disputed bets
        if (bet.status !== 'disputed') {
          return NextResponse.json(
            { error: 'Can only vote on disputed bets' },
            { status: 400 }
          );
        }
        
        await connectToDatabase();
        
        const { voteChoice } = vote;
        if (!voteChoice) {
          return NextResponse.json(
            { error: 'Vote choice is required' },
            { status: 400 }
          );
        }
        
        // Get username
        const voteUserQuery = await pool.query(
          'SELECT username FROM users WHERE user_id = $1',
          [userId]
        );
        const voteUsername = voteUserQuery.rows[0]?.username || 'Unknown User';
        
        // Check if user already voted
        const existingBet = await Bet.findOne({ 'creator.userId': bet.creator_id, title: bet.title });
        
        if (existingBet) {
          const existingVote = existingBet.votes.find(v => v.userId.toString() === userId);
          
          if (existingVote) {
            // Update existing vote
            await Bet.updateOne(
              { 
                'creator.userId': bet.creator_id, 
                title: bet.title,
                'votes.userId': userId 
              },
              { 
                $set: { 
                  'votes.$.vote': voteChoice,
                  'votes.$.votedAt': new Date()
                } 
              }
            );
          } else {
            // Add new vote
            await Bet.findOneAndUpdate(
              { 'creator.userId': bet.creator_id, title: bet.title },
              { 
                $push: { 
                  votes: {
                    userId,
                    username: voteUsername,
                    vote: voteChoice,
                    votedAt: new Date()
                  } 
                } 
              }
            );
          }
          
          // Also add vote to SQL database
          // First check if vote exists
          const voteCheck = await pool.query(
            'SELECT * FROM bet_votes WHERE bet_id = $1 AND voter_id = $2',
            [betId, userId]
          );
          
          if (voteCheck.rows.length > 0) {
            // Update existing vote
            await pool.query(
              'UPDATE bet_votes SET vote = $1, voted_at = NOW() WHERE bet_id = $2 AND voter_id = $3',
              [voteChoice, betId, userId]
            );
          } else {
            // Create new vote
            await pool.query(
              'INSERT INTO bet_votes (bet_id, voter_id, vote, voted_at) VALUES ($1, $2, $3, NOW())',
              [betId, userId, voteChoice]
            );
          }
          
          // Check if we have enough votes to auto-resolve
          // We need at least 3 votes and >75% agreement
          if (existingBet.votes.length >= 3) {
            const voteResults = existingBet.votes.reduce((acc, v) => {
              acc[v.vote] = (acc[v.vote] || 0) + 1;
              return acc;
            }, {});
            
            const mostVotes = Math.max(...Object.values(voteResults) as number[]);
            const totalVotes = existingBet.votes.length;
            
            // If >75% agreement on most popular vote
            if (mostVotes / totalVotes > 0.75) {
              const winningOutcome = Object.keys(voteResults).find(key => voteResults[key] === mostVotes);
              
              // Auto-resolve the bet
              await pool.query(
                'UPDATE bets SET outcome = $1, status = $2, updated_at = NOW() WHERE bet_id = $3',
                [winningOutcome, 'completed', betId]
              );
              
              // Handle user stats updates based on outcome
              await handleOutcomeStats(bet, winningOutcome);
              
              // Update MongoDB
              await Bet.findOneAndUpdate(
                { 'creator.userId': bet.creator_id, title: bet.title },
                { outcome: winningOutcome, status: 'completed' }
              );
              
              // Create notifications for both users
              await pool.query(
                `INSERT INTO notifications 
                  (user_id, type, title, message, related_id, is_read, created_at)
                VALUES 
                  ($1, 'dispute_resolved', 'Dispute Resolved', $2, $3, false, NOW())`,
                [bet.creator_id, `The dispute for "${bet.title}" has been resolved through community voting`, betId]
              );
              
              if (bet.opponent_id) {
                await pool.query(
                  `INSERT INTO notifications 
                    (user_id, type, title, message, related_id, is_read, created_at)
                  VALUES 
                    ($1, 'dispute_resolved', 'Dispute Resolved', $2, $3, false, NOW())`,
                  [bet.opponent_id, `The dispute for "${bet.title}" has been resolved through community voting`, betId]
                );
              }
            }
          }
        }
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      message: 'Bet updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating bet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user stats based on bet outcome
async function handleOutcomeStats(bet, outcome) {
  try {
    const creatorId = bet.creator_id;
    const opponentId = bet.opponent_id;
    
    if (!creatorId || !opponentId) return;
    
    if (outcome === 'win_creator') {
      // Creator wins
      await updateUserStats(creatorId, 'win');
      await updateUserStats(opponentId, 'loss');
    } else if (outcome === 'win_opponent') {
      // Opponent wins
      await updateUserStats(creatorId, 'loss');
      await updateUserStats(opponentId, 'win');
    } else if (outcome === 'draw') {
      // Draw
      await updateUserStats(creatorId, 'draw');
      await updateUserStats(opponentId, 'draw');
    }
    // No stats updates for voided bets
    
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

// Helper function to update a single user's stats
async function updateUserStats(userId, resultType) {
  try {
    // Get current stats
    const statsQuery = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [userId]
    );
    
    if (statsQuery.rows.length === 0) return;
    
    const stats = statsQuery.rows[0];
    let { wins, losses, draws, current_streak, longest_streak, total_bets } = stats;
    
    // Update appropriate counter
    if (resultType === 'win') {
      wins += 1;
      current_streak = current_streak > 0 ? current_streak + 1 : 1;
    } else if (resultType === 'loss') {
      losses += 1;
      current_streak = current_streak < 0 ? current_streak - 1 : -1;
    } else if (resultType === 'draw') {
      draws += 1;
      current_streak = 0;
    }
    
    // Update longest streak if needed
    if (Math.abs(current_streak) > longest_streak) {
      longest_streak = Math.abs(current_streak);
    }
    
    // Update total bets and win rate
    total_bets = wins + losses + draws;
    const winRate = total_bets > 0 ? ((wins / total_bets) * 100).toFixed(2) : 0;
    
    // Update in database
    await pool.query(
      `UPDATE user_stats 
       SET wins = $1, losses = $2, draws = $3, current_streak = $4, 
           longest_streak = $5, total_bets = $6, win_rate = $7, updated_at = NOW()
       WHERE user_id = $8`,
      [wins, losses, draws, current_streak, longest_streak, total_bets, winRate, userId]
    );
    
  } catch (error) {
    console.error('Error updating individual user stats:', error);
  }
}