const express = require('express');
const router = express.Router();
const { createTestUser } = require('../controllers/testController');

// Test route - only available in development
if (process.env.NODE_ENV !== 'production') {
  router.post('/create-test-user', createTestUser);
  
  // Add a simple GET route to test if the test endpoint is accessible
  router.get('/test', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Test endpoint is working',
      environment: process.env.NODE_ENV || 'development',
      time: new Date().toISOString()
    });
  });
}

module.exports = router;
