const User = require('../models/User.cjs');
const UnverifiedUser = require('../models/UnverifiedUser.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('./authController.cjs');
const { getWelcomeEmailTemplate } = require('../utils/welcomeTemplate');
const sendEmail = require('../utils/email.cjs');

// Verify user email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token to match the stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    console.log('Verification attempt with token (hashed):', hashedToken);
    
    // Find unverified user with this token
    const unverifiedUser = await UnverifiedUser.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() }
    });

    if (!unverifiedUser) {
      console.log('No unverified user found with the provided token or token expired');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token. Please request a new verification email.'
      });
    }

    // Create new user
    const user = new User({
      username: unverifiedUser.username,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      fullName: unverifiedUser.fullName,
      isVerified: true
    });

    // Save user and remove from unverified
    await Promise.all([
      user.save(),
      UnverifiedUser.findByIdAndDelete(unverifiedUser._id)
    ]);

    // Send welcome email in the background
    (async () => {
      try {
        const logoUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/logo.png`;
        const contactEmail = process.env.CONTACT_EMAIL || 'support@blazetrade.de';
        const emailHtml = getWelcomeEmailTemplate(
          user.fullName || user.username,
          logoUrl,
          contactEmail
        );
        
        console.log(`Sending welcome email to ${user.email}`);
        
        await sendEmail({
          to: user.email,
          subject: 'Welcome to BlazeTrade!',
          html: emailHtml,
          text: `Welcome to BlazeTrade, ${user.fullName || user.username}! We're excited to have you on board.`
        });
        
        console.log(`Welcome email sent to ${user.email}`);
      } catch (err) {
        console.error('Error sending welcome email:', {
          email: user.email,
          error: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        // In production, you might want to add this to a retry queue
      }
    })();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        isVerified: true
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { ...user._doc, password: undefined } });
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Input validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.'
      });
    }

    // Check if email is already verified
    const verifiedUser = await User.findOne({ email });
    if (verifiedUser) {
      return res.status(200).json({
        success: true,
        message: 'This email is already verified. You can now log in.'
      });
    }
    
    // Find unverified user
    const unverifiedUser = await UnverifiedUser.findOne({ email });
    
    if (!unverifiedUser) {
      return res.status(200).json({
        success: false,
        message: 'No unverified account found with this email. Please sign up.'
      });
    }

    // Rate limiting: Check if last resend was too recent (prevent spam)
    const now = Date.now();
    const lastResendTime = unverifiedUser.lastResendAttempt || 0;
    const timeSinceLastResend = now - lastResendTime;
    const minResendInterval = 2 * 60 * 1000; // 2 minutes
    
    if (timeSinceLastResend < minResendInterval) {
      const timeLeft = Math.ceil((minResendInterval - timeSinceLastResend) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${timeLeft} seconds before requesting another verification email.`
      });
    }

    // Generate new verification token and update user
    unverifiedUser.verificationToken = crypto.randomBytes(32).toString('hex');
    unverifiedUser.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    unverifiedUser.lastResendAttempt = Date.now();
    await unverifiedUser.save();

    try {
      // Send verification email
      await sendVerificationEmail(
        unverifiedUser.email,
        unverifiedUser.username,
        unverifiedUser.verificationToken
      );

      res.status(200).json({
        success: true,
        message: 'Verification email resent. Please check your inbox (and spam folder).'
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      
      // Reset the lastResendAttempt if email sending fails
      unverifiedUser.lastResendAttempt = undefined;
      await unverifiedUser.save();

      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
