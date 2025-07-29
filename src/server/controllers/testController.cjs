const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { getVerificationEmailTemplate } = require('../utils/welcomeTemplate');

// Initialize logging
const log = (message, data = null, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message };
  
  if (data) {
    logEntry.data = data;
  }
  
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  return logEntry;
};

/**
 * @route   POST /api/test/create-test-user
 * @desc    Create a test user and send verification email
 * @access  Public (for testing only)
 */
exports.createTestUser = async (req, res) => {
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const startTime = Date.now();
  
  log(`[${testId}] Starting test user creation`, {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
  
  try {
    // Generate a unique test email
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@test.blazetrade.de`;
    
    // Create test user
    const testUser = new User({
      username: `testuser_${timestamp}`,
      email: testEmail,
      password: 'Test@12345', // Default test password
      isVerified: false,
      verificationToken: require('crypto').randomBytes(20).toString('hex'),
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    testUser.password = await bcrypt.hash(testUser.password, salt);

    // Save test user
    await testUser.save();

    // Generate verification URL
    const clientUrl = process.env.CLIENT_URL || 'https://blazetrade.de';
    const serverUrl = process.env.SERVER_URL || 'https://blazetrade.de';
    const verificationUrl = `${clientUrl}/verify-email/${testUser.verificationToken}`;
    const logoUrl = `${serverUrl}/logo.png`;
    
    log(`[${testId}] Generated verification URL`, {
      verificationUrl,
      logoUrl,
      clientUrl,
      serverUrl,
      verificationToken: testUser.verificationToken
    });
    
    // Prepare email content
    const emailHtml = getVerificationEmailTemplate(testUser.username, verificationUrl, logoUrl);
    const emailSubject = 'Verify Your Test Account - BlazeTrade';
    
    log(`[${testId}] Sending verification email`, {
      to: testEmail,
      subject: emailSubject,
      verificationUrl,
      timestamp: new Date().toISOString()
    });
    
    // Send verification email
    const emailResult = await sendEmail({
      to: testEmail,
      subject: emailSubject,
      html: emailHtml,
      text: `Hello test user! Please verify your email by clicking this link: ${verificationUrl}`
    });
    
    log(`[${testId}] Email sent successfully`, {
      emailId: emailResult.messageId,
      timestamp: new Date().toISOString(),
      response: emailResult.data
    });

    const responseData = {
      success: true,
      message: 'Test user created and verification email sent',
      testId,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
      user: {
        id: testUser._id,
        email: testUser.email,
        username: testUser.username,
        isVerified: testUser.isVerified
      },
      verificationUrl: verificationUrl, // For testing purposes
      emailId: emailResult.messageId
    };

    log(`[${testId}] Test user creation completed successfully`, responseData);
    
    res.status(200).json(responseData);

  } catch (err) {
    const errorData = {
      testId,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code
      },
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`
    };
    
    log(`[${testId}] Test user creation failed`, errorData, 'error');
    
    const response = {
      success: false,
      message: 'Error creating test user',
      testId,
      timestamp: new Date().toISOString()
    };
    
    if (process.env.NODE_ENV === 'development') {
      response.error = {
        message: err.message,
        stack: err.stack
      };
    }
    
    res.status(500).json(response);
  }
};
