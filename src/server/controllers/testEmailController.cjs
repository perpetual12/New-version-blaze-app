const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/email.cjs');
const { getWelcomeEmailTemplate } = require('../utils/welcomeTemplate.js');

// Test email sending
const testEmail = async (req, res) => {
    const testEmail = req.query.email || 'test@example.com';
    const testId = uuidv4().substring(0, 8);
    
    try {
        const logoUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/logo.png`;
        const emailHtml = getWelcomeEmailTemplate('Test User', logoUrl);
        
        console.log(`\n📧 [TEST-${testId}] Sending test email to: ${testEmail}`);
        
        await sendEmail({
            to: testEmail,
            subject: `Test Email from BlazeTrade (${testId})`,
            html: emailHtml,
            text: 'This is a test email from BlazeTrade',
            emailType: 'test'
        });
        
        res.status(200).json({
            success: true,
            message: 'Test email sent successfully',
            testId,
            email: testEmail
        });
        
    } catch (error) {
        console.error(`❌ [TEST-${testId}] Failed to send test email:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message,
            testId
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
