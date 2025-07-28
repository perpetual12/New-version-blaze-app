/**
 * Chatbot Controller
 * Handles processing of chatbot messages and responses
 */

// Predefined responses for the chatbot
const botResponses = {
  greetings: [
    "Hello! Welcome to BlazeTrad. How can I assist you today?",
    "Hi there! I'm BlazeTrad's virtual assistant. What would you like to know about our services?",
    "Welcome to BlazeTrad! I'm here to help with any questions about our Bitcoin exchange and trading services."
  ],
  about: [
    "BlazeTrad is a professional Bitcoin exchange and trading platform. We provide secure and reliable cryptocurrency services with a focus on user experience and security.",
    "Founded with a mission to make cryptocurrency trading accessible to everyone, BlazeTrad offers a range of services including Bitcoin exchange, trading, and buying of gift cards."
  ],
  services: [
    "Our services include Bitcoin exchange, cryptocurrency trading, market analysis, portfolio management, security solutions, and consulting services.",
    "At BlazeTrad, we offer comprehensive cryptocurrency services including buying and selling Bitcoin, trading strategies, market insights, and personalized portfolio management."
  ],
  security: [
    "Security is our top priority. We implement industry-leading security measures including cold storage, two-factor authentication, and regular security audits to protect your assets.",
    "BlazeTrad uses advanced encryption and multi-signature technology to ensure the highest level of security for your cryptocurrency assets."
  ],
  fees: [
    "Our fee structure is transparent and competitive. Trading fees range from 0.1% to 0.5% depending on your trading volume. Please visit our services page for detailed information.",
    "BlazeTrad offers competitive fees with discounts for high-volume traders. Our basic trading fee is 0.2% per transaction."
  ],
  contact: [
    "You can contact our support team at contact@blazetrad.com or call us at +1 (555) 123-4567. We're available 24/7 to assist you.",
    "For any inquiries, please email us at contact@blazetrad.com or use the contact form on our website. Our team is ready to help!"
  ],
  default: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I don't have information on that specific topic. Would you like to know about our services, security measures, or how to contact us?",
    "I'm still learning! For more detailed information, please contact our support team at contact@blazetrad.com."
  ]
};

/**
 * Process chatbot messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.processMessage = (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    // Get bot response based on user input
    const botResponse = getBotResponse(message);
    
    // Add a small delay to simulate thinking (optional)
    setTimeout(() => {
      res.json({ success: true, response: botResponse });
    }, 500);
    
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Get appropriate bot response based on user input
 * @param {string} input - User message
 * @returns {string} - Bot response
 */
const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  // Check for keywords in the input
  if (/(hi|hello|hey|greetings)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.greetings);
  } else if (/(about|who are you|company|brand)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.about);
  } else if (/(services|offer|provide|trading|exchange)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.services);
  } else if (/(secure|security|safe|protection)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.security);
  } else if (/(fee|cost|price|charge)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.fees);
  } else if (/(contact|email|phone|reach|support)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.contact);
  } else if (/(advantage|benefit|better|why choose|why use)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.advantages);
  } else if (/(history|founded|start|begin|origin)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.history);
  } else if (/(team|staff|employee|expert|founder)/i.test(lowerInput)) {
    return getRandomResponse(botResponses.team);
  } else {
    return getRandomResponse(botResponses.default);
  }
};

/**
 * Get a random response from an array of responses
 * @param {Array} responseArray - Array of possible responses
 * @returns {string} - Random response
 */
const getRandomResponse = (responseArray) => {
  return responseArray[Math.floor(Math.random() * responseArray.length)];
};