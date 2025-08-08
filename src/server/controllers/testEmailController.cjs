const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/email.cjs');
const { getWelcomeEmailTemplate } = require('../utils/welcomeTemplate.js');

// Test email sending
const testEmail = async (req, res) => {
    const testEmail = req.query.email || 'test@example.com';
    const testId = uuidv4().substring(0, 8);
    
    try {
        console.log(`\n📧 [TEST-${testId}] Starting test email to: ${testEmail}`);
        
        // Log environment variables (safely)
        console.log(`[TEST-${testId}] Environment check:`, {
            NODE_ENV: process.env.NODE_ENV,
            SERVER_URL: process.env.SERVER_URL,
            EMAIL_FROM: process.env.EMAIL_FROM,
            RESEND_API_KEY: process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT SET'
        });
        
        const logoUrl = `${process.env.SERVER_URL || 'https://blazetrade.de'}/logo.png`;
        console.log(`[TEST-${testId}] Using logo URL:`, logoUrl);
        
        console.log(`[TEST-${testId}] Generating welcome email template...`);
        const emailHtml = getWelcomeEmailTemplate('Test User', logoUrl);
        
        console.log(`[TEST-${testId}] Sending test welcome email...`);
        const emailResult = await sendEmail({
            to: testEmail,
            subject: `Test Welcome Email from BlazeTrade (${testId})`,
            html: emailHtml,
            text: 'This is a test welcome email from BlazeTrade.',
            emailType: 'test_welcome'
        });
        
        console.log(`[TEST-${testId}] Test email sent successfully:`, {
            email: testEmail,
            timestamp: new Date().toISOString(),
            result: emailResult
        });
        
        res.status(200).json({
            success: true,
            message: 'Test email sent successfully',
            testId,
            email: testEmail,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        const errorDetails = {
            testId,
            email: testEmail,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            timestamp: new Date().toISOString()
        };
        
        console.error(`❌ [TEST-${testId}] Failed to send test email:`, errorDetails);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            ...errorDetails
        });
    }
};

// Get sent emails for verification
const getSentEmails = (req, res) => {
    try {
        // This would need to be implemented to track sent emails
        res.status(200).json({
            success: true,
            count: 0, // Placeholder
            message: 'Email tracking not fully implemented in this version'
        });
    } catch (error) {
        console.error('Error getting sent emails:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve sent emails',
            error: error.message
        });
    }
};

module.exports = {
    testEmail,
    getSentEmails
};
