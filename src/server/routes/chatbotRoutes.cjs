const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// @route   POST api/chatbot/message
// @desc    Process chatbot messages
// @access  Public
router.post('/message', chatbotController.processMessage);

module.exports = router;