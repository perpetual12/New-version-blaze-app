/**
 * Contact Controller
 * Handles contact form submissions
 */

/**
 * Submit contact form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitContactForm = (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }
    
    // In a real application, you would:
    // 1. Store the contact form submission in a database
    // 2. Send an email notification to the admin
    // 3. Send a confirmation email to the user
    
    // For this demo, we'll just simulate a successful submission
    console.log('Contact form submission:', { name, email, subject, message });
    
    // Send success response
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};