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

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://blazetrade.de',
  'https://www.blazetrade.de'
];

// Configure CORS with specific options
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the request origin is in the allowed origins
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import test verification controller
const testVerification = require('./controllers/testVerification');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('  Headers:', req.headers);
  next();
});

// API Routes - must come before static file serving
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api', require('./routes/verification.cjs')); 
app.use('/api/chatbot', require('./routes/chatbotRoutes.cjs'));
app.use('/api/contact', require('./routes/contactRoutes.cjs'));

// Test verification route (temporary)
app.get('/api/test/verification-status', testVerification);

// Test Email Routes (for development and debugging)
if (process.env.NODE_ENV !== 'production') {
  const testEmailController = require('./controllers/testEmailController.cjs');
  // Add explicit route handlers for test endpoints
  app.get('/api/test/email', (req, res, next) => {
    console.log('Test email endpoint hit');
    testEmailController.testEmail(req, res).catch(next);
  });
  app.get('/api/test/emails', testEmailController.getSentEmails);
  console.log('🔧 Test email routes registered');
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
const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});