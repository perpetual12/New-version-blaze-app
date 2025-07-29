const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { getVerificationEmailTemplate } = require('../utils/welcomeTemplate');

/**
 * @route   POST /api/test/create-test-user
 * @desc    Create a test user and send verification email
 * @access  Public (for testing only)
 */
exports.createTestUser = async (req, res) => {
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
    const verificationUrl = `${process.env.CLIENT_URL || 'https://blazetrade.de'}/verify-email/${testUser.verificationToken}`;
    const logoUrl = `${process.env.SERVER_URL || 'https://blazetrade.de'}/logo.png`;
    
    // Send verification email
    const emailHtml = getVerificationEmailTemplate(testUser.username, verificationUrl, logoUrl);
    
    await sendEmail({
      to: testEmail,
      subject: 'Verify Your Test Account - BlazeTrade',
      html: emailHtml,
      text: `Hello test user! Please verify your email by clicking this link: ${verificationUrl}`
    });

    res.status(200).json({
      success: true,
      message: 'Test user created and verification email sent',
      user: {
        id: testUser._id,
        email: testUser.email,
        username: testUser.username,
        isVerified: testUser.isVerified
      },
      verificationUrl: verificationUrl // For testing purposes
    });

  } catch (err) {
    console.error('Test User Creation Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating test user',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
  }
};
