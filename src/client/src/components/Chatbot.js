import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingYesNo, setAwaitingYesNo] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses for the chatbot
  const botResponses = {
    greetings: token 
      ? [
          "Hello! Welcome back to BlazeTrade. How can I assist you today?",
          "Welcome back! I'm here to help with any questions about your account or our services.",
        ]
      : [
          "Hello! Welcome to BlazeTrade. Login to start trading.",
          "Hi there! Please login to access all our trading features.",
        ],
    about: [
      "BlazeTrade is a professional Bitcoin exchange and trading platform established in 2018. We provide secure and reliable cryptocurrency services with a focus on user experience and security.",
      "Founded with a mission to make cryptocurrency trading accessible to everyone, BlazeTrade offers a range of services including Bitcoin exchange, trading, and buying of giftcards.",
      "BlazeTrade is a leading cryptocurrency platform serving over 10,000 active users worldwide. Our team consists of blockchain experts and financial professionals dedicated to providing the best trading experience."
    ],
    services: [
      "Our services include Bitcoin exchange, cryptocurrency trading, market analysis, portfolio management, security solutions, and consulting services.",
      "At BlazeTrade, we offer comprehensive cryptocurrency services including buying and selling Bitcoin, trading strategies, market insights, and personalized portfolio management.",
      "BlazeTrade provides institutional-grade trading tools with real-time market data, advanced charting, and algorithmic trading options for both beginners and professional traders."
    ],
    security: [
      "Security is our top priority. We implement industry-leading security measures including cold storage, two-factor authentication, and regular security audits to protect your assets.",
      "BlazeTrade uses advanced encryption and multi-signature technology to ensure the highest level of security for your cryptocurrency assets.",
      "We keep 95% of user funds in cold storage protected by multi-signature technology. Our platform undergoes regular penetration testing and security audits by third-party experts."
    ],
    fees: [
      "Our fee structure is transparent and competitive. Trading fees range from 0.1% to 0.5% depending on your trading volume. Please visit our services page for detailed information.",
      "BlazeTrade offers competitive fees with discounts for high-volume traders. Our basic trading fee is 0.2% per transaction.",
      "We offer tiered fee discounts based on 30-day trading volume. VIP clients trading over $1M monthly enjoy fees as low as 0.05% and dedicated account managers."
    ],
    contact: [
      "You can contact our support team at contact@BlazeTrade.com or call us at +1 (555) 123-4567. We're available 24/7 to assist you.",
      "For any inquiries, please email us at contact@blazeTrade.com or use the contact form on our website. Our team is ready to help!",
      "Our headquarters is located in New York with regional offices in London, Singapore, and Tokyo. Technical support is available 24/7 via live chat, email, or phone."
    ],
    advantages: [
      "BlazeTrade offers several advantages including institutional-grade security, 24/7 customer support, competitive fees, and a user-friendly interface designed for both beginners and professionals.",
      "What sets BlazeTrade apart is our combination of advanced trading tools, educational resources, and personalized portfolio management services tailored to each client's needs."
    ],
    history: [
      "BlazeTrade was founded in 2018 by a team of blockchain enthusiasts and financial experts with a vision to make cryptocurrency trading accessible, secure, and transparent for everyone.",
      "Since our founding, we've grown to serve clients in over 100 countries, processed more than $5 billion in trading volume, and maintained a 99.9% platform uptime."
    ],
    team: [
      "Our leadership team includes former executives from major financial institutions and blockchain pioneers with over 50 years of combined experience in fintech and cryptocurrency markets.",
      "BlazeTrade employs over 120 professionals worldwide, including blockchain developers, security experts, financial analysts, and customer support specialists."
    ],
    default: [
      "I'm not sure I understand. Could you please rephrase your question?",
      "I don't have information on that specific topic. Would you like to know about our services, security measures, or how to contact us?",
      "For more detailed information, please contact our support team at contact@BlazeTrade.com."
    ],
    goodbye: [
      "Goodbye! Have a great day!",
    ],
    help: [
      "Sure! I can assist you with any questions you have about our services, security measures, or how to contact us.",
      "I'm here to help! Let me know if you have any specific questions or need assistance."
    ],
    how_to_trade_with_blazetrade: [
      "To trade with BlazeTrade, you'll need to send a whatsapp message to blazetrade @+2348163309355. Once you send us a message, you can access our trading platform and start trading your favorite cryptocurrencies.",
    ],
    thanks: [
      "You're welcome! Is there anything else I can help you with?",
      "Happy to help! Let me know if you have any other questions.",
      "No problem! Feel free to ask if anything else comes to mind."
    ],
    yes: [
      "Great! How can I help you?",
      "Sure, what do you need help with?",
      "I am here to help. What is your question?",
    ],
    no: [
      "Alright, have a great day!",
      "No problem, feel free to reach out if you need anything else.",
      "Okay, goodbye!",
    ],
    trade: [
      "To trade with BlazeTrade, you'll need to send a whatsapp message to blazetrade @+2348163309355. Once you send us a message, you can access our trading platform and start trading your favorite cryptocurrencies."
    ]
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to toggle the chatbot
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time
      const randomGreeting = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
      setTimeout(() => {
        setMessages([{ text: randomGreeting, sender: 'bot' }]);
      }, 500);
    }
  };

  // Function to handle sending a message
  const handleEndChat = () => {
    setMessages([]);
    setInputValue('');
    const randomGreeting = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    setTimeout(() => {
      setMessages([{ text: randomGreeting, sender: 'bot' }]);
    }, 500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking and respond after a delay
    setTimeout(() => {
      const botMessage = { text: getBotResponse(inputValue), sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Function to determine bot response based on user input
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
    } else if (/(thanks|thank you|appreciate it)/i.test(lowerInput)) {
      setAwaitingYesNo(true);
      return getRandomResponse(botResponses.thanks);
    } else if (awaitingYesNo) {
      if (/(yes|yeah|sure)/i.test(lowerInput)) {
        setAwaitingYesNo(false);
        return getRandomResponse(botResponses.yes);
      } else if (/(no|nope|nah)/i.test(lowerInput)) {
        setAwaitingYesNo(false);
        return getRandomResponse(botResponses.no);
      } else {
        setAwaitingYesNo(false);
        return getRandomResponse(botResponses.default);
      }
    } else if (/(how to trade|trade with you|start trading)/i.test(lowerInput)) {
      return getRandomResponse(botResponses.trade);
    } else {
      return getRandomResponse(botResponses.default);
    }
  };

  // Function to get a random response from an array
  const getRandomResponse = (responseArray) => {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-dark text-white flex items-center justify-center shadow-lg hover:bg-primary-light transition-colors duration-300 z-50"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat header */}
            <div className="bg-primary-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaRobot />
                <span className="font-medium">BlazeTrade Assistant</span>
              </div>
              <div>
                <button 
                  onClick={handleEndChat}
                  className="text-white hover:text-gray-300 transition-colors mr-2"
                >
                  End Chat
                </button>
                <button 
                  onClick={toggleChat}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' 
                      ? 'bg-primary-dark text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <FaRobot className="mt-1 text-primary-dark" />
                      )}
                      <div>{message.text}</div>
                      {message.sender === 'user' && (
                        <FaUser className="mt-1 text-white" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  className="flex justify-start mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-gray-100 border-t border-gray-200 flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-dark text-gray-800"
                autoComplete="off"
              />
              <button 
                type="submit"
                className="bg-primary-dark text-white px-4 py-2 rounded-r-md hover:bg-primary-light transition-colors flex items-center justify-center"
                disabled={inputValue.trim() === ''}
              >
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;