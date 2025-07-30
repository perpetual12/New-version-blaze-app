const sendEmail = require('./src/server/utils/email.cjs');
const { getWelcomeEmailTemplate } = require('./src/server/utils/welcomeTemplate.js');

async function testEmailSending() {
    try {
        console.log('🔄 Testing email sending...');
        
        const logoUrl = 'https://blazetrade.de/logo.png';
        const emailHtml = getWelcomeEmailTemplate('Test User', logoUrl);
        
        console.log('📧 Sending test email...');
        
        const result = await sendEmail({
            to: 'obasekiperpetua@gmail.com',
            subject: 'Test Email from BlazeTrade',
            html: emailHtml,
            text: 'This is a test email from BlazeTrade',
            emailType: 'test'
        });
        
        console.log('✅ Email sent successfully!');
        console.log('Result:', result);
        
    } catch (error) {
        console.error('❌ Error sending test email:');
        console.error(error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}

testEmailSending();
