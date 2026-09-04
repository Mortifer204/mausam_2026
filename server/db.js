import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    console.log('[MongoDB Atlas] Connecting to cluster...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('[MongoDB Atlas] Connected successfully to DB:', mongoose.connection.name);
    return mongoose.connection;
  } catch (err) {
    console.error('[MongoDB Atlas Connection Error]:', err.message);
    throw err;
  }
}

export default connectDB;