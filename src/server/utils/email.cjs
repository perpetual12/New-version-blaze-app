const { Resend } = require('resend');
const dotenv = require('dotenv');

// Initialize logging
const log = (message, data = null, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message };
  
  if (data) {
    logEntry.data = data;
  }
  
  // In production, you might want to send this to a logging service
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  
  return logEntry;
};

dotenv.config();

// Log environment configuration
log('Email Service Initializing...');
log('Environment Variables Check', {
  NODE_ENV: process.env.NODE_ENV,
  RESEND_API_KEY: process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT SET',
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLIENT_URL: process.env.CLIENT_URL
});

// Initialize Resend with your API key
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables');
  throw new Error('Email service configuration error: RESEND_API_KEY is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Track sent emails for verification
const sentEmails = [];

const sendEmail = async (options) => {
  // Generate a unique ID for this email
  const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const startTime = Date.now();
  
  // Log the start of the email sending process
  const logContext = {
    emailId,
    to: options.to,
    subject: options.subject,
    hasHtml: !!options.html,
    timestamp: new Date().toISOString()
  };
  
  log(`[${emailId}] Starting email send process`, logContext);

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
    
    // Prepare email data with proper headers and tracking
    const emailData = {
      from: fromAddress,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      // Add plain text version for better deliverability
      text: options.text || options.subject.replace(/<[^>]*>?/gm, ''),
      headers: {
        'X-Entity-Ref-ID': emailId,
        'X-Environment': process.env.NODE_ENV || 'production',
        'X-Application': 'BlazeTrade',
        'X-Email-Type': options.emailType || 'transactional'
      }
    };

    // Log email data (safely)
    log(`[${emailId}] Prepared email data`, {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      emailType: options.emailType
    });

    // Add to sent emails for verification
    const emailRecord = {
      id: emailId,
      to: emailData.to,
      subject: emailData.subject,
      sentAt: new Date().toISOString(),
      status: 'sending'
    };
    sentEmails.push(emailRecord);
    
    // Send email with timeout
    const emailPromise = resend.emails.send(emailData);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email sending timeout')), 15000) // 15 second timeout
    );

    const { data, error } = await Promise.race([emailPromise, timeoutPromise]);

    if (error) {
      const errorDetails = {
        emailId,
        status: error.statusCode,
        name: error.name,
        message: error.message,
        details: error,
        timestamp: new Date().toISOString()
      };
      
      log(`[${emailId}] Email sending failed`, errorDetails, 'error');
      
      // Log detailed error information for debugging
      if (error.response) {
        log(`[${emailId}] Resend API Error Response`, {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data
        }, 'error');
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }

    // Log successful email delivery
    const successData = { 
      emailId,
      messageId: data.id,
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString(),
      response: data
    };
    
    log(`[${emailId}] Email sent successfully`, successData, 'info');
    
    return { 
      success: true, 
      messageId: data.id,
      data 
    };
  } catch (error) {
    const errorData = {
      emailId,
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      timestamp: new Date().toISOString()
    };
    
    log(`[${emailId}] Unhandled error in sendEmail`, errorData, 'error');
    
    // For production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorTrackingService(errorData);
    }
    
    throw error; // Re-throw to be handled by the calling function
  }
};

module.exports = sendEmail;
