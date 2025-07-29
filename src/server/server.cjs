// 🔴 DEBUG: Start of file
console.log("✅ 1. server.cjs is being executed");

// Load required modules
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
console.log("📁 Current working directory:", process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log("🔍 Looking for .env at:", envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ dotenv error:", result.error);
  process.exit(1);
} else {
  console.log("✅ 2. dotenv loaded successfully");
}

// Check for MONGO_URI
console.log("🔐 MONGO_URI =", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("🚨 FATAL ERROR: MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

// Load Express and other dependencies
const express = require('express');
const cors = require('cors');

// Connect to database
const connectDB = require('./config/db.cjs');
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api', require('./routes/verification.cjs')); 
app.use('/api/chatbot', require('./routes/chatbotRoutes.cjs'));
app.use('/api/contact', require('./routes/contactRoutes.cjs'));

// Test routes - only available in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Test routes enabled');
  app.use('/api/test', require('./routes/test.cjs'));
}

// Serve React App in Production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));
  console.log("📦 Serving static files from:", buildPath);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});