const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define evidence schema (sub-document)
const evidenceSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: String,
  evidenceType: { 
    type: String, 
    required: true, 
    enum: ['image', 'text', 'link', 'video'] 
  },
  content: { 
    type: String, 
    required: true 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Define comment schema (sub-document)
const commentSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: String,
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    default: null 
  } // For threaded comments
});

// Define participant schema (sub-document)
const participantSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: String,
  participantType: { 
    type: String, 
    required: true, 
    enum: ['creator', 'opponent', 'witness', 'judge'] 
  },
  participantChoice: String, // Their choice or selection if applicable
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Define vote schema (sub-document)
const voteSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: String,
  vote: { 
    type: String, 
    required: true, 
    enum: ['creator_wins', 'opponent_wins', 'draw', 'void'] 
  },
  votedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Main Bet schema
const betSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: false 
  },
  creator: { 
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    username: String
  },
  opponent: { 
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    username: String
  },
  category: { 
    categoryId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category' 
    },
    name: String
  },
  stake: { 
    type: String, 
    required: true 
  }, // Non-monetary stake
  monetaryStake: { 
    amount: { 
      type: Number, 
      default: null 
    },
    currency: { 
      type: String, 
      default: 'USD' 
    }
  }, // For monetary bets extension
  deadline: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'active', 'completed', 'canceled', 'disputed'], 
    default: 'pending' 
  },
  outcome: { 
    type: String, 
    enum: ['win_creator', 'win_opponent', 'draw', 'voided'], 
    default: null 
  },
  privacy: { 
    type: String, 
    enum: ['public', 'friends', 'private'], 
    default: 'friends' 
  },
  isMonetary: { 
    type: Boolean, 
    default: false 
  },
  
  // Embedded Collections
  participants: [participantSchema],
  evidence: [evidenceSchema],
  comments: [commentSchema],
  votes: [voteSchema]
}, {
  timestamps: true // This adds createdAt and updatedAt
});

// Indexes for performance
betSchema.index({ 'creator.userId': 1 });
betSchema.index({ 'opponent.userId': 1 });
betSchema.index({ status: 1 });
betSchema.index({ deadline: 1 });
betSchema.index({ 'category.categoryId': 1 });

// Virtual for time remaining
betSchema.virtual('timeRemaining').get(function() {
  if (this.deadline) {
    const now = new Date();
    return this.deadline > now ? this.deadline - now : 0;
  }
  return 0;
});

// Pre-save middleware to update timestamps
betSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
betSchema.methods = {
  // Add participant to the bet
  addParticipant: function(userId, username, type, choice = null) {
    this.participants.push({
      userId: userId,
      username: username,
      participantType: type,
      participantChoice: choice,
      joinedAt: new Date()
    });
    return this.save();
  },
  
  // Add evidence to the bet
  addEvidence: function(userId, username, type, content) {
    this.evidence.push({
      userId: userId,
      username: username,
      evidenceType: type,
      content: content,
      submittedAt: new Date()
    });
    return this.save();
  },
  
  // Add comment to the bet
  addComment: function(userId, username, content, parentId = null) {
    this.comments.push({
      userId: userId,
      username: username,
      content: content,
      parentId: parentId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return this.save();
  },
  
  // Add vote for resolution
  addVote: function(userId, username, voteChoice) {
    // Check if user already voted
    const existingVoteIndex = this.votes.findIndex(v => v.userId.toString() === userId.toString());
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      this.votes[existingVoteIndex].vote = voteChoice;
      this.votes[existingVoteIndex].votedAt = new Date();
    } else {
      // Add new vote
      this.votes.push({
        userId: userId,
        username: username,
        vote: voteChoice,
        votedAt: new Date()
      });
    }
    return this.save();
  },
  
  // Complete the bet with outcome
  complete: function(outcome) {
    this.status = 'completed';
    this.outcome = outcome;
    this.updatedAt = new Date();
    return this.save();
  },
  
  // Mark bet as disputed
  dispute: function() {
    this.status = 'disputed';
    this.updatedAt = new Date();
    return this.save();
  }
};

// Static methods
betSchema.statics = {
  // Find active bets for a user
  findActiveByUser: function(userId) {
    return this.find({
      $or: [
        { 'creator.userId': userId },
        { 'opponent.userId': userId },
        { 'participants.userId': userId }
      ],
      status: { $in: ['pending', 'active'] }
    }).sort({ deadline: 1 });
  },
  
  // Find completed bets for a user
  findCompletedByUser: function(userId) {
    return this.find({
      $or: [
        { 'creator.userId': userId },
        { 'opponent.userId': userId },
        { 'participants.userId': userId }
      ],
      status: 'completed'
    }).sort({ updatedAt: -1 });
  },
  
  // Find bets by category
  findByCategory: function(categoryId) {
    return this.find({ 'category.categoryId': categoryId }).sort({ createdAt: -1 });
  },
  
  // Find bets that are pending resolution and past their deadline
  findPendingResolution: function() {
    return this.find({
      status: 'active',
      deadline: { $lt: new Date() }
    }).sort({ deadline: 1 });
  },
  
  // Search bets
  search: function(query) {
    return this.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      privacy: { $ne: 'private' }
    }).limit(20);
  }
};

module.exports = mongoose.model('Bet', betSchema);