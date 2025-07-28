const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// @route   POST api/contact/submit
// @desc    Submit contact form
// @access  Public
router.post('/submit', contactController.submitContactForm);

module.exports = router;