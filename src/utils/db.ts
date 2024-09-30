import mongoose from 'mongoose';

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aes-be';

// Connection function
export const connectToDatabase = async (): Promise<void> => {

  try {
    await mongoose.connect(uri);
    console.log('Connected successfully to MongoDB using Mongoose');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
