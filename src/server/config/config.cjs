/**
 * Server Configuration
 */

require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOptions: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL || 'https://yourdomain.com' 
      : 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};