const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

// Debug: Log environment variables (remove in production)
console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
console.log('Email From:', process.env.EMAIL_FROM);

// Initialize Resend with your API key
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables');
  throw new Error('Email service configuration error: RESEND_API_KEY is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  console.log('Sending email with options:', {
    to: options.to,
    subject: options.subject,
    from: process.env.EMAIL_FROM,
    hasHtml: !!options.html
  });

  try {
    if (!options.to) {
      throw new Error('No recipient email address provided');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('No sender email address configured (EMAIL_FROM)');
    }

    // Ensure the from field is properly formatted for Resend
    let fromAddress = process.env.EMAIL_FROM;
    
    // If EMAIL_FROM doesn't have angle brackets, format it properly
    if (fromAddress && !/<.*>/.test(fromAddress)) {
      fromAddress = `BlazeTrade <${fromAddress}>`;
    }
    
    const emailData = {
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      // Add plain text version for better deliverability
      text: options.text || options.subject.replace(/<[^>]*>?/gm, ''), // Remove HTML tags for text version
    };
    
    console.log('Formatted email data:', JSON.stringify({
      ...emailData,
      html: emailData.html ? '[HTML CONTENT]' : undefined // Don't log full HTML
    }, null, 2));

    console.log('Sending email with data:', JSON.stringify(emailData, null, 2));

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend API Error:', {
        status: error.statusCode,
        name: error.name,
        message: error.message,
        details: error
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully. Response:', data);
    return { 
      success: true, 
      messageId: data.id,
      data 
    };
  } catch (error) {
    console.error('Error in sendEmail:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    throw error; // Re-throw to be handled by the calling function
  }
};

module.exports = sendEmail;
