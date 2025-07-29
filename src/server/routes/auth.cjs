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
    check('username', 'Username is required').trim().notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    check('terms', 'You must accept the terms and conditions').equals('true')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  },
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

// @route   POST api/auth/forgot-password
// @desc    Send password reset token to user's email
// @access  Public
router.post(
  '/forgot-password',
  [
    check('email', 'Please provide a valid email').isEmail()
  ],
  authController.forgotPassword
);

// @route   GET api/auth/verify-reset-token/:token
// @desc    Verify password reset token
// @access  Public
router.get('/verify-reset-token/:token', authController.verifyResetToken);

// @route   PATCH api/auth/reset-password/:token
// @desc    Reset user password with token
// @access  Public
router.patch(
  '/reset-password/:token',
  [
    check('password', 'Please provide a password with at least 6 characters').isLength({ min: 6 })
  ],
  authController.resetPassword
);

// @route   GET api/auth/user/:id
// @desc    Get user by ID
// @access  Private
router.get('/user/:id', authController.getUserById);

module.exports = router;