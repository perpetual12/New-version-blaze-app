const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1);
  }

  // Connection configuration
  const options = {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
    connectTimeoutMS: 30000, // 30 seconds connect timeout
  };

  // Enable debug mode in development
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  // Event handlers for connection events
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');  
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', mongoUri.replace(/:([^:]+)@/, ':***@')); // Log masked connection string
    
    await mongoose.connect(mongoUri, options);
    console.log('MongoDB Connected successfully.');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.error('Connection string used:', mongoUri.replace(/:([^:]+)@/, ':***@'));
    process.exit(1);
  }
};

module.exports = connectDB;