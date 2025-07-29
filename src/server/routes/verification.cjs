const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { verifyEmail, resendVerification } = require('../controllers/verificationController.cjs');

// @route   GET /api/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', verifyEmail);

// @route   POST /api/resend-verification
// @desc    Resend verification email
// @access  Public
router.post(
  '/resend-verification',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  resendVerification
);

module.exports = router;
