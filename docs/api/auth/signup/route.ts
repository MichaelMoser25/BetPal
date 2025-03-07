import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { fullName, email, username, password } = await req.json();

    // Validate input
    if (!fullName || !email || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate UUID
    const userId = uuidv4();

    // Create new user
    const newUser = await pool.query(
      `INSERT INTO users 
        (user_id, username, email, full_name, password_hash, created_at, updated_at, is_active, preferences) 
       VALUES 
        ($1, $2, $3, $4, $5, NOW(), NOW(), true, $6) 
       RETURNING user_id, username, email, full_name, created_at`,
      [
        userId,
        username,
        email,
        fullName,
        hashedPassword,
        JSON.stringify({ emailNotifications: true, theme: 'light' })
      ]
    );

    // Initialize user stats
    await pool.query(
      `INSERT INTO user_stats 
        (user_id, wins, losses, draws, current_streak, longest_streak, total_bets, win_rate, updated_at) 
       VALUES 
        ($1, 0, 0, 0, 0, 0, 0, 0.00, NOW())`,
      [userId]
    );

    // Return success response (excluding sensitive data)
    return NextResponse.json({
      message: 'User created successfully',
      user: newUser.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error in user signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}