const getWelcomeEmailTemplate = (fullName, logoUrl, contactEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to BlazeTrade</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #0a2351; padding: 40px; text-align: center; }
        .header img { max-width: 180px; }
        .content { padding: 30px 40px; color: #333; line-height: 1.6; }
        .content h1 { color: #0a2351; }
        .content p { margin-bottom: 20px; }
        .cta-button { display: inline-block; background-color: #3B82F6; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; }
        .features { margin-top: 30px; }
        .features h2 { color: #0a2351; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-bottom: 20px; }
        .features ul { list-style: none; padding: 0; }
        .features li { padding: 10px 0; border-bottom: 1px solid #f4f4f4; }
        .footer { background-color: #f4f4f4; color: #777; padding: 20px 40px; text-align: center; font-size: 12px; }
        .footer a { color: #3B82F6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="BlazeTrade Logo">
        </div>
        <div class="content">
          <h1>Welcome, ${fullName}!</h1>
          <p>We are thrilled to have you join the BlazeTrade community. You are now ready to explore a fast, secure, and reliable trading experience.</p>
          <a href="#" class="cta-button">Start Trading Now</a>
          <div class="features">
            <h2>Your Trading Options:</h2>
            <ul>
              <li>&#x1F4B0; Instantly Buy & Sell Bitcoin</li>
              <li>&#x1F4B1; Exchange Gift Cards for Crypto</li>
              <li>&#x1F512; Manage Your Secure Digital Wallet</li>
              <li>&#x1F4AC; 24/7 Support via our AI Chatbot</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to <a href="mailto:${contactEmail}">contact our support team</a>.</p>
          <p>This email was sent from ${contactEmail}.</p>
          <p>&copy; ${new Date().getFullYear()} BlazeTrade. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getVerificationEmailTemplate = (fullName, verificationUrl, logoUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your BlazeTrade Account</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #0A2540; color: white; padding: 20px; text-align: center; }
        .header img { max-width: 150px; }
        .content { padding: 30px; color: #333; line-height: 1.6; }
        .content h1 { color: #0A2540; }
        .button { display: inline-block; background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f9f9f9; color: #777; padding: 20px; text-align: center; font-size: 12px; }
        .footer a { color: #007BFF; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="BlazeTrade Logo">
        </div>
        <div class="content">
          <h1>Verify Your Email Address</h1>
          <p>Hi ${fullName},</p>
          <p>Thanks for signing up for BlazeTrade! To complete your registration, please click the button below to verify your email address.</p>
          <a href="${verificationUrl}" class="button">Verify My Account</a>
          <p>This link will expire in one hour. If you did not sign up for a BlazeTrade account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>&copy; ${new Date().getFullYear()} BlazeTrade. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getWelcomeEmailTemplate, getVerificationEmailTemplate };
