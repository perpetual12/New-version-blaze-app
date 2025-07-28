const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController.cjs');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.signup
);

// @route   GET api/auth/verify-email/:token
// @desc    Verify user's email
// @access  Public
router.get('/verify-email/:token', authController.verifyEmail);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET api/auth/user/:id
// @desc    Get user by ID
// @access  Private
router.get('/user/:id', authController.getUserById);

module.exports = router;