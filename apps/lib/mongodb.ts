import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/betpal';

let cachedConnection: typeof mongoose | null = null;

export async function connectToMongoDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Optional: Function to create database indexes
export async function createIndexes() {
  try {
    // Example of creating an index on Bet model
    // This should be called once when your app starts
    // await mongoose.model('Bet').createIndexes();
    console.log('MongoDB indexes created successfully');
  } catch (error) {
    console.error('Error creating MongoDB indexes:', error);
  }
}
