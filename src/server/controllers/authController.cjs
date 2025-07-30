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
          
          // Construct the verification URL
          const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
          
          // Pass the raw token to the template function
          const emailHtml = getVerificationEmailTemplate(
            fullName || username,
            verificationToken,
            logoUrl
          );
          
          console.log(`Sending verification email to ${email}`);
          console.log('Verification token being used:', verificationToken);
          console.log('Verification URL:', verificationUrl);
          
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
  console.log('\n=== Starting Email Verification ===');
  console.log('Request received at:', new Date().toISOString());
  
  // Debug: Log environment
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  
  const session = await mongoose.startSession();
  console.log('MongoDB session created');
  
  try {
    await session.startTransaction();
    console.log('Transaction started');
    
    const rawToken = req.params.token;
    console.log('Raw token from URL:', rawToken ? `[${rawToken.length} chars]` : 'Missing');
    
    if (!rawToken || rawToken.length < 10) {
      const error = new Error('Invalid token format');
      error.statusCode = 400;
      throw error;
    }
    
    // Hash the token to find the unverified user
    console.log('Hashing token...');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    console.log('Hashed token:', hashedToken);

    // Check collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Debug: Check if collection exists and has documents
    const unverifiedUsersCount = await UnverifiedUser.countDocuments({}).session(session);
    console.log(`Unverified users in database: ${unverifiedUsersCount}`);
    
    // Find unverified user by token with detailed logging
    console.log('Searching for unverified user with token...');
    const query = {
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() }
    };
    
    console.log('Query:', JSON.stringify(query, null, 2));
    
    const unverifiedUser = await UnverifiedUser
      .findOne(query)
      .session(session)
      .lean();

    console.log('Unverified user found:', unverifiedUser ? 'Yes' : 'No');
    
    if (unverifiedUser) {
      console.log('User details:', {
        email: unverifiedUser.email,
        username: unverifiedUser.username,
        tokenExpires: new Date(unverifiedUser.verificationExpires).toISOString(),
        isExpired: unverifiedUser.verificationExpires < Date.now()
      });
    }

    if (!unverifiedUser) {
      // Try to find any user with this token (even expired) for debugging
      const anyUser = await UnverifiedUser
        .findOne({ verificationToken: hashedToken })
        .session(session)
        .lean();
        
      if (anyUser) {
        console.log('Found user with matching token but it might be expired:', {
          email: anyUser.email,
          expires: new Date(anyUser.verificationExpires).toISOString(),
          isExpired: anyUser.verificationExpires < Date.now()
        });
      }
      
      const error = new Error('Invalid or expired verification token');
      error.statusCode = 400;
      error.isExpired = anyUser && anyUser.verificationExpires < Date.now();
      throw error;
    }

    // Check if user already exists (in case of duplicate signup attempts)
    const existingUser = await User.findOne({ 
      $or: [
        { email: unverifiedUser.email },
        { username: unverifiedUser.username }
      ]
    }).session(session);

    if (existingUser) {
      console.log('User already exists with this email/username:', unverifiedUser.email);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'An account with this email or username already exists.'
      });
    }

    // Create new user in the main users collection
    const newUser = new User({
      username: unverifiedUser.username,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      fullName: unverifiedUser.fullName,
      isVerified: true
    });

    console.log('Creating new user with verification status:', {
      email: newUser.email,
      isVerified: newUser.isVerified,
      userId: newUser._id
    });

    // Save the new user
    const savedUser = await newUser.save({ session });
    console.log('User saved successfully:', {
      email: savedUser.email,
      isVerified: savedUser.isVerified,
      userId: savedUser._id
    });
    
    // Remove the unverified user
    await UnverifiedUser.findByIdAndDelete(unverifiedUser._id).session(session);
    console.log('Unverified user record removed:', unverifiedUser._id);
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log('Verification successful for user:', unverifiedUser.email);
    
    // For API clients
    if (req.accepts('json')) {
      return res.status(200).json({
        success: true,
        message: 'Email verification successful',
        msg: 'Email verification successful. You can now log in.'
      });
    }
    
    // For browser redirects
    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?verified=true`;
    res.redirect(loginUrl);
    
  } catch (err) {
    console.error('\n=== Verification Process Error ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    
    // Try to abort any open transaction
    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
        console.log('Transaction aborted due to error');
      } catch (abortErr) {
        console.error('Error aborting transaction:', abortErr);
      }
    }
    
    // End the session if it exists
    if (session) {
      try {
        await session.endSession();
      } catch (endSessionErr) {
        console.error('Error ending session:', endSessionErr);
      }
    }
    
    // Send appropriate error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An error occurred during email verification';
    
    // For API clients
    if (req.accepts('json')) {
      return res.status(statusCode).json({
        success: false,
        message: message, // Keep for backward compatibility
        msg: message,    // Add this line to match frontend expectations
        ...(process.env.NODE_ENV !== 'production' && { error: err.toString() })
      });
    }
    
    // For browser redirects
    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?verificationError=${encodeURIComponent(message)}`;
    res.redirect(loginUrl);
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

  const { email, username, password } = req.body;

  // Log the complete incoming request for debugging
  console.log('=== LOGIN REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Request body:', JSON.stringify({
    email: email ? 'present' : 'missing',
    username: username ? 'present' : 'missing',
    password: password ? 'present' : 'missing'
  }, null, 2));
  console.log('====================');

  // Check if either email or username is provided
  const loginIdentifier = email || username;
  const isEmail = email && typeof email === 'string' && email.includes('@');
  
  if (!loginIdentifier || typeof loginIdentifier !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Email or username is required',
      error: 'No login identifier provided',
      received: { email, username },
      type: { email: typeof email, username: typeof username }
    });
  }
  
  // Log the login attempt with identifier type
  console.log(`Login attempt with ${isEmail ? 'email' : 'username'}:`, loginIdentifier);

  // Validate password is present
  if (!password) {
    const errorMessage = 'Password is required';
    console.error('Login validation error:', errorMessage);
    return res.status(400).json({
      success: false,
      message: errorMessage,
      error: errorMessage
    });
  }

  try {
    console.log('Login attempt for email:', email);
    
    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log('Normalized email for login:', normalizedEmail);
    
    // Build the query based on whether we have an email or username
    const query = isEmail 
      ? { email: { $regex: new RegExp(`^${loginIdentifier}$`, 'i') } }
      : { username: loginIdentifier };
    
    // Check if user exists in either collection
    const [user, unverifiedUser] = await Promise.all([
      User.findOne(query).select('+password'),
      UnverifiedUser.findOne(query).select('+password')
    ]);
    
    console.log('Login check - User found:', {
      inUsersCollection: !!user,
      inUnverifiedUsers: !!unverifiedUser,
      userVerified: user?.isVerified,
      userEmail: user?.email,
      userUsername: user?.username,
      unverifiedUserEmail: unverifiedUser?.email,
      unverifiedUsername: unverifiedUser?.username,
      usingEmailLogin: isEmail,
      loginIdentifier
    });

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

      // Debug: Log user verification status
      console.log('User verification status:', {
        email: user.email,
        isVerified: user.isVerified,
        userType: 'User',
        userId: user._id,
        userObject: JSON.stringify(user, null, 2) // Log the full user object for debugging
      });

      // Check if user is verified - using direct property access
      const isUserVerified = user.isVerified === true || user.isVerified === 'true';
      
      if (!isUserVerified) {
        console.log(`Login attempt with unverified email: ${email}`, {
          isVerified: user.isVerified,
          typeOfIsVerified: typeof user.isVerified
        });
        return res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in',
          unverified: true,
          email: user.email,
          canResend: true,
          debug: {
            isVerified: user.isVerified,
          }
        });
      }

      // Create JWT Payload
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      };

      console.log('JWT Payload:', JSON.stringify(payload, null, 2));
      console.log('JWT Secret:', process.env.JWT_SECRET ? 'Present' : 'MISSING');

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret_here', // Fallback for testing
        { expiresIn: '24h' },
        (err, token) => {
          if (err) {
            console.error('JWT Sign Error:', err);
            return res.status(500).json({ 
              success: false,
              message: 'Error generating token',
              error: err.message
            });
          }
          
          console.log('Generated Token:', token ? 'Token generated successfully' : 'Token is NULL');
          
          // Remove sensitive data before sending response
          const userData = user.toObject();
          delete userData.password;
          
          const response = { 
            success: true,
            token,
            user: {
              id: userData._id,
              email: userData.email,
              username: userData.username,
              isVerified: true
            }
          };
          
          console.log('Sending response:', JSON.stringify(response, null, 2));
          res.json(response);
        }
      );
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