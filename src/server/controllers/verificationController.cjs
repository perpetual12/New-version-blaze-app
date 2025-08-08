const crypto = require('crypto');
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

    // Log successful user verification
    console.log('✅ User verified successfully:', JSON.stringify({
      event: 'user_verified',
      userId: user._id,
      email: user.email,
      username: user.username,
      timestamp: new Date().toISOString(),
      verificationToken: hashedToken
    }, null, 2));

    // Send welcome email in the background with better error handling
    (async () => {
      try {
        const welcomeEmailId = `welcome_${Date.now()}`;
        const welcomeEmailInfo = {
          event: 'welcome_email_send_attempt',
          emailId: welcomeEmailId,
          userId: user._id,
          email: user.email,
          username: user.username,
          timestamp: new Date().toISOString()
        };

        console.log('📧 Starting welcome email process:', JSON.stringify(welcomeEmailInfo, null, 2));
        
        const logoUrl = `${process.env.SERVER_URL || 'https://blazetrade.de'}/logo.png`;
        const contactEmail = process.env.CONTACT_EMAIL || 'blazetrade@blazetrade.de';
        
        const emailHtml = getWelcomeEmailTemplate(
          user.fullName || user.username,
          logoUrl,
          contactEmail
        );
        
        const emailResult = await sendEmail({
          to: user.email,
          subject: 'Welcome to BlazeTrade!',
          html: emailHtml,
          text: `Welcome to BlazeTrade, ${user.fullName || user.username}! We're excited to have you on board.`,
          emailType: 'welcome'
        });
        
        const successInfo = {
          ...welcomeEmailInfo,
          event: 'welcome_email_sent',
          status: 'success',
          messageId: emailResult.messageId,
          sentAt: new Date().toISOString(),
          timestamp: new Date().toISOString()
        };
        
        console.log('✅ Welcome email sent successfully:', JSON.stringify(successInfo, null, 2));
        
      } catch (err) {
        const errorInfo = {
          ...welcomeEmailInfo,
          event: 'welcome_email_failed',
          status: 'error',
          error: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
          timestamp: new Date().toISOString()
        };
        
        console.error('❌ Error sending welcome email:', JSON.stringify(errorInfo, null, 2));
        
        // In production, you might want to add this to a retry queue
        if (process.env.NODE_ENV === 'production') {
          // Example: addToRetryQueue('welcome_email', { userId: user._id, email: user.email });
        }
      }
    })();
    
    // Redirect to the verification success page
    const clientUrl = process.env.CLIENT_URL || 'https://blazetrade.de';
    return res.redirect(`${clientUrl}/verification-success`);
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
      // Send verification email with detailed logging
    const verificationUrl = `${process.env.CLIENT_URL || 'https://blazetrade.de'}/api/verify-email/${unverifiedUser.verificationToken}`;
    const verificationEmailInfo = {
      to: unverifiedUser.email,
      username: unverifiedUser.username,
      verificationToken: unverifiedUser.verificationToken,
      verificationUrl: verificationUrl,
      timestamp: new Date().toISOString()
    };

    console.log('📧 Sending verification email:', JSON.stringify({
      event: 'verification_email_send_attempt',
      ...verificationEmailInfo,
      tokenPreview: `${unverifiedUser.verificationToken.substring(0, 8)}...`,
      expiresAt: new Date(unverifiedUser.verificationExpires).toISOString()
    }, null, 2));
      await sendVerificationEmail(
        unverifiedUser.email,
        unverifiedUser.username,
        unverifiedUser.verificationToken
      );

      console.log('✅ Verification email sent successfully:', JSON.stringify({
        event: 'verification_email_sent',
        ...verificationEmailInfo,
        status: 'success',
        sentAt: new Date().toISOString()
      }, null, 2));

      res.status(200).json({
        success: true,
        message: 'Verification email resent. Please check your inbox (and spam folder).',
        email: unverifiedUser.email
      });
    } catch (emailError) {
      const errorDetails = {
        event: 'verification_email_failed',
        ...verificationEmailInfo,
        error: emailError.message,
        stack: process.env.NODE_ENV === 'development' ? emailError.stack : undefined,
        timestamp: new Date().toISOString()
      };
      
      console.error('❌ Error sending verification email:', JSON.stringify(errorDetails, null, 2));
      
      // Reset the lastResendAttempt if email sending fails
      unverifiedUser.lastResendAttempt = undefined;
      await unverifiedUser.save();

      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.',
        email: unverifiedUser.email
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
