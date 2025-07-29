const crypto = require('crypto');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User.cjs');
const UnverifiedUser = require('../models/UnverifiedUser.cjs');
const sendEmail = require('../utils/email.cjs');
const { getWelcomeEmailTemplate, getVerificationEmailTemplate } = require('../utils/welcomeTemplate.js');

// Helper function to send verification email
const sendVerificationEmail = async (email, username, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  const logoUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/logo.png`;
  
  const emailHtml = getVerificationEmailTemplate(username, verificationUrl, logoUrl);
  
  await sendEmail({
    to: email,
    subject: 'Verify Your BlazeTrade Account',
    html: emailHtml,
    text: `Hello ${username}, please verify your email by clicking this link: ${verificationUrl}`
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  console.log('Signup attempt with data:', { 
    username, 
    email, 
    hasPassword: !!password,
    fullName 
  });
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Check if user already exists in either collection
      const [existingUser, existingUnverified] = await Promise.all([
        User.findOne({ $or: [{ email }, { username }] }).session(session),
        UnverifiedUser.findOne({ $or: [{ email }, { username }] }).session(session)
      ]);

      if (existingUser || existingUnverified) {
        const error = new Error('User with this email or username already exists');
        error.statusCode = 400;
        throw error;
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create unverified user
      const unverifiedUser = new UnverifiedUser({
        username,
        email,
        password: hashedPassword,
        fullName: fullName || username,
        verificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
        verificationExpires
      });

      // Save unverified user
      await unverifiedUser.save({ session });

      // Send verification email with the original (unhashed) token
      (async () => {
        try {
          console.log('Sending verification email to:', email, 'with token:', verificationToken);
          const logoUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/logo.png`;
          
          // Pass the raw token to the template function
          const emailHtml = getVerificationEmailTemplate(
            fullName || username,
            verificationToken, // Pass the raw token, not the URL
            logoUrl
          );
          
          console.log(`Sending verification email to ${email}`);
          console.log('Verification token being used:', verificationToken);
          
          await sendEmail({
            to: email,
            subject: 'Verify Your BlazeTrade Account',
            html: emailHtml,
            text: `Hello ${fullName || username}, please verify your email by clicking this link: ${verificationUrl}`
          });
          
          console.log(`Verification email sent to ${email}`);
        } catch (err) {
          console.error('Error sending verification email:', {
            email,
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
          });
          // In production, you might want to add this to a retry queue
        }
      })();
    });

    // If we get here, the transaction was successful
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error:', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Server error during registration' : error.message;
    
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  } finally {
    await session.endSession();
  }
};

// @desc    Verify user's email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    console.log('Verification attempt with token:', req.params.token);
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user by token first, without checking expiration
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    if (!user) {
      console.log('Verification Failed: Token not found in database.');
      return res.status(400).json({ msg: 'Invalid verification link.' });
    }

    // Now check if the token has expired
    if (user.emailVerificationTokenExpires < Date.now()) {
      console.log('Verification Failed: Token has expired.');
      return res.status(400).json({ msg: 'Expired verification link. Please request a new one.' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    console.log('Verification successful for user:', user.email);
    res.json({ msg: 'Email verification successful. You can now log in.' });
  } catch (err) {
    console.error('Verification Process Error:', err);
    res.status(500).send('Server error during verification');
  }
};

// @desc    Get user by ID
// @route   GET /api/auth/user/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    console.log('Fetching user with ID:', req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID format',
        details: `The provided ID '${req.params.id}' is not a valid MongoDB ObjectId`
      });
    }

    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      console.log('User not found with ID:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        error: 'User not found',
        details: `No user found with ID: ${req.params.id}`
      });
    }
    
    console.log('User found:', { id: user._id, username: user.username });
    res.json({
      success: true,
      data: user
    });
    
  } catch (err) {
    console.error('Error in getUserById:', {
      error: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue
    });
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user ID format',
        details: 'The provided ID is not a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user data',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists in either collection
    const [user, unverifiedUser] = await Promise.all([
      User.findOne({ email }).select('+password'),
      UnverifiedUser.findOne({ email }).select('+password')
    ]);

    // If user doesn't exist in either collection
    if (!user && !unverifiedUser) {
      console.log('Login attempt with non-existent email:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // If user exists but is not verified
    if (unverifiedUser) {
      // Verify password
      const isMatch = await bcrypt.compare(password, unverifiedUser.password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Email not verified',
        unverified: true,
        email: unverifiedUser.email,
        canResend: true
      });
    }

    // If user exists and is verified
    if (user) {
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Failed login attempt for user: ${email}`);
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        console.log(`Login attempt with unverified email: ${email}`);
        return res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in',
          unverified: true,
          email: user.email,
          canResend: true
        });
      }

      // Create and return JWT token
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isVerified: true
        }
      };

      // Generate token with expiration
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Set HTTP-only cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Remove sensitive data before sending response
      const userData = user.toObject();
      delete userData.password;
      
      // Send response with user data (excluding sensitive info)
      res.json({ 
        success: true,
        user: {
          id: userData._id,
          email: userData.email,
          username: userData.username,
          isVerified: true
        }
      });
    }
  } catch (error) {
    console.error('Login error:', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      email
    });

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1) Check if user exists with this email
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // 2) Generate the random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3) Set token expiry to 1 hour
    const passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // 4) Save the token and expiry to the database
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save({ validateBeforeSave: false });

    // 5) Send email with reset URL
    try {
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      const logoUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/logo.png`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0a2351; padding: 20px; text-align: center;">
            <img src="${logoUrl}" alt="BlazeTrade Logo" style="max-width: 150px;">
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #0a2351;">Forgot Your Password?</h2>
            <p>Hi ${user.username},</p>
            <p>We received a request to reset the password for your BlazeTrade account. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, please ignore this email or contact support at blazetrade@blazetrade.de if you have questions.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Thanks,<br>The BlazeTrade Team</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
            <p>${resetUrl}</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Your BlazeTrade Password Reset Token (Valid for 1 hour)',
        html: emailHtml,
        text: `Use this link to reset your password: ${resetUrl}. This link is valid for 1 hour.`
      });

      res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (err) {
      // If email sending fails, remove the reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error('Error sending password reset email:', err);
      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the password reset email. Please try again later.'
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request.'
    });
  }
};

// @desc    Verify password reset token
// @route   GET /api/auth/verify-reset-token/:token
// @access  Public
const verifyResetToken = async (req, res) => {
  try {
    // 1) Get user based on the token and check if token is not expired
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, token is valid
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired. Please request a new password reset.'
      });
    }

    // 3) If everything is ok, send success response
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      email: user.email // Optional: Send back user email for display
    });
  } catch (err) {
    console.error('Verify reset token error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying the reset token.'
    });
  }
};

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // 1) Get user based on the token and check if token is not expired
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired. Please request a new password reset.'
      });
    }

    // 3) Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 4) Update password and reset token fields
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // 5) Log the user in, send JWT
    const token = jwt.sign(
      { id: user._id, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6) Send success response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified
        }
      }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while resetting your password.'
    });
  }
};

// Export all controller functions
const authController = {
  signup: signup,
  verifyEmail: verifyEmail,
  login: login,
  getUserById: getUserById,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  verifyResetToken: verifyResetToken,
  sendVerificationEmail: sendVerificationEmail
};

module.exports = authController;