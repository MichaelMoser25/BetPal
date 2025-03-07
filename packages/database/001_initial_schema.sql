-- BetPal Database Schema (SQL Version)

-- Users Table: Stores basic user information
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB -- Store user preferences as JSON
);

-- User Stats: For leaderboards and user profiles
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_bets INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories: Bet categories like sports, politics, etc.
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Friendships: Manages user connections
CREATE TABLE friendships (
    friendship_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- Bets Table: Core betting functionality
CREATE TABLE bets (
    bet_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    opponent_id UUID REFERENCES users(user_id), -- Can be NULL for open bets
    category_id INTEGER REFERENCES categories(category_id),
    stake VARCHAR(255) NOT NULL, -- What's at stake (non-monetary)
    monetary_stake DECIMAL(10,2), -- For monetary bets extension (optional)
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, active, completed, canceled, disputed
    outcome VARCHAR(20), -- win_creator, win_opponent, draw, voided
    privacy VARCHAR(20) DEFAULT 'friends', -- public, friends, private
    is_monetary BOOLEAN DEFAULT FALSE -- Flag for monetary bets
);

-- Bet Participants: For group bets with multiple participants
CREATE TABLE bet_participants (
    bet_id UUID REFERENCES bets(bet_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    participant_type VARCHAR(20) NOT NULL, -- creator, opponent, witness, etc.
    participant_choice VARCHAR(255), -- Their choice/selection if applicable
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bet_id, user_id)
);

-- Bet Evidence: Proof submitted for bet resolution
CREATE TABLE bet_evidence (
    evidence_id SERIAL PRIMARY KEY,
    bet_id UUID NOT NULL REFERENCES bets(bet_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    evidence_type VARCHAR(20) NOT NULL, -- image, text, link, etc.
    content TEXT NOT NULL, -- URL or text content
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bet Comments: Social interaction on bets
CREATE TABLE bet_comments (
    comment_id SERIAL PRIMARY KEY,
    bet_id UUID NOT NULL REFERENCES bets(bet_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    parent_id INTEGER REFERENCES bet_comments(comment_id) -- For threaded comments
);

-- Bet Votes: For community resolution of disputed bets
CREATE TABLE bet_votes (
    vote_id SERIAL PRIMARY KEY,
    bet_id UUID NOT NULL REFERENCES bets(bet_id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vote VARCHAR(20) NOT NULL, -- creator_wins, opponent_wins, draw, void
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bet_id, voter_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- bet_request, bet_result, friend_request, reminder, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_id UUID, -- ID of the related entity (bet, user, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Achievements Table
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    criteria JSONB -- JSON criteria for earning achievement
);

-- User Achievements: Junction table
CREATE TABLE user_achievements (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Activity Feed: For recording user activities for the feed
CREATE TABLE activity_feed (
    activity_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- created_bet, won_bet, earned_achievement, etc.
    target_id UUID, -- ID of the target entity (bet, user, etc.)
    target_type VARCHAR(20), -- bet, user, achievement, etc.
    content TEXT, -- Custom text or description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    privacy VARCHAR(20) DEFAULT 'friends' -- public, friends, private
);

-- Authentication Tokens: For password reset, email verification, etc.
CREATE TABLE auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- reset_password, verify_email, refresh_token
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE
);

-- Index creation for better performance
CREATE INDEX idx_bets_creator ON bets(creator_id);
CREATE INDEX idx_bets_opponent ON bets(opponent_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);