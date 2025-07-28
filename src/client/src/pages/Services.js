import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaBitcoin,
  FaChartLine, 
  FaChartBar, 
  FaShieldAlt, 
  FaUserTie,
  FaArrowRight,
  FaCheck
} from 'react-icons/fa';

const Services = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <ServicesHero />
      
      {/* Services List */}
      <ServicesList />
      
      {/* Featured Service */}
      <FeaturedService />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* FAQ */}
      <FAQSection />
    </div>
  );
};

// Services Hero Section
const ServicesHero = () => {
  return (
    <section className="relative bg-primary-dark text-white py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-accent opacity-10 blur-3xl"></div>
        <div className="absolute left-0 top-0 w-1/4 h-1/4 bg-primary-light opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 mb-8">
            Comprehensive cryptocurrency solutions tailored to your needs. 
            From Bitcoin exchange to advanced trading tools, we've got you covered.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Services List Section
const ServicesList = () => {
  const services = [
    {
      id: "bitcoin-exchange",
      icon: <FaBitcoin className="text-4xl text-yellow-500" />,
      title: "Bitcoin Exchange",
      description: "Buy and sell Bitcoin and other cryptocurrencies with competitive rates and low fees. Our exchange platform provides a secure and user-friendly experience for both beginners and experienced traders.",
      features: [
        "Competitive exchange rates",
        "Low transaction fees",
        "Fast processing times",
        "Multiple payment options",
        "Secure transactions"
      ]
    },
    {
      id: "crypto-trading",
      icon: <FaChartLine className="text-4xl text-accent" />,
      title: "Crypto Trading",
      description: "Trade cryptocurrencies with advanced tools, charts, and market analysis. Our trading platform offers a range of features to help you make informed trading decisions and maximize your returns.",
      features: [
        "Advanced trading tools",
        "Real-time market data",
        "Customizable charts",
        "Stop-loss and take-profit orders",
        "Margin trading options"
      ]
    },
    {
      id: "market-analysis",
      icon: <FaChartBar className="text-4xl text-green-500" />,
      title: "Market Analysis",
      description: "Get detailed market insights and analysis to make informed trading decisions. Our team of experts provides regular market reports, trend analysis, and trading recommendations.",
      features: [
        "Daily market reports",
        "Technical analysis",
        "Trend identification",
        "Price prediction models",
        "Trading signals"
      ]
    },
    
    {
      id: "security-solutions",
      icon: <FaShieldAlt className="text-4xl text-red-500" />,
      title: "Security Solutions",
      description: "Advanced security solutions to protect your digital assets and investments. We implement industry-leading security measures to ensure the safety of your cryptocurrency holdings.",
      features: [
        "Cold storage solutions",
        "Multi-signature wallets",
        "Two-factor authentication",
        "Regular security audits",
        "Insurance coverage"
      ]
    },
    {
      id: "consulting",
      icon: <FaUserTie className="text-4xl text-orange-500" />,
      title: "Consulting Services",
      description: "Expert consulting services for individuals and businesses entering the crypto space. Our consultants provide guidance on cryptocurrency investments, blockchain technology, and regulatory compliance.",
      features: [
        "Investment strategies",
        "Blockchain implementation",
        "Regulatory compliance",
        "ICO/STO advisory",
        "Market entry strategies"
      ]
    }
  ];

  return (
    <section className="section bg-white" id="services">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id}
              id={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Service Section
const FeaturedService = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="section bg-gray-50" id="featured-service">
      <div className="container-custom">
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3
              }
            }
          }}
        >
          {/* Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="mb-4">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Featured Service</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary-dark">Advanced Bitcoin Trading Platform</h2>
            <p className="text-gray-600 mb-6">
              Our advanced Bitcoin trading platform provides you with all the tools and resources you need to succeed in the cryptocurrency market. 
              With real-time market data, customizable charts, and a range of order types, you can execute your trading strategies with precision and confidence.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Real-time market data and price alerts",
                "Advanced charting tools with multiple indicators",
                "Various order types including limit, market, and stop orders",
                "Low latency execution for high-frequency trading",
                "Mobile trading app for trading on the go"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheck className="text-accent mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <a href="https://wa.me/2348163309355" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center">
              Start Trading Now <FaArrowRight className="ml-2" />
            </a>
          </motion.div>
          
          {/* Image */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-dark rounded-lg opacity-10 blur-xl transform translate-x-4 translate-y-4"></div>
            <div className="relative bg-white p-4 rounded-lg shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded overflow-hidden">
                {/* This would be a chart or trading interface image */}
                <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary-light p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaChartLine className="text-6xl mx-auto mb-4" />
                    <p className="text-lg font-semibold">Trading Interface</p>
                    <p className="text-sm opacity-75">Advanced charts and tools</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">BTC/USD</span>
                  <span className="text-green-500 font-semibold">$48,235.67</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>24h Change</span>
                  <span className="text-green-500">+3.45%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "0.2%",
      description: "Per transaction",
      features: [
        "Standard exchange rates",
        "Basic trading tools",
        "Email support",
        "Standard security features",
        "Mobile app access"
      ],
      cta: "Start Trading",
      popular: false
    },
    {
      name: "Pro",
      price: "0.15%",
      description: "Per transaction",
      features: [
        "Competitive exchange rates",
        "Advanced trading tools",
        "Priority email support",
        "Enhanced security features",
        "API access",
        "Portfolio management tools"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored pricing",
      features: [
        "Premium exchange rates",
        "Full suite of trading tools",
        "24/7 dedicated support",
        "Advanced security solutions",
        "Custom API integration",
        "Personalized consulting",
        "White-label solutions"
      ],
      cta: "Contact Us",
      popular: false
    }
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      question: "How do I start trading with BlazeTrade?",
      answer: "To start trading on BlazeTrade, you need to chat us on whatsapp or instagram and then you can begin trading cryptocurrencies or redemption of gift cards."
    },
    {
      question: "What cryptocurrencies can I trade with BlazeTrade?",
      answer: "BlazeTrade supports trading of major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Ripple (XRP), buying of giftcards and many more. We regularly add new cryptocurrencies based on market demand and our evaluation process."
    },
    {
      question: "How secure is BlazeTrade?",
      answer: "Security is our top priority. We implement industry-leading security measures including cold storage for the majority of assets. regular security audits. We're a registered trading brand and our CAC number is RC 3696301"
    },
    {
      question: "What are the fees for trading with BlazeTrade?",
      answer: "Our fee structure is transparent and competitive. Trading fees range from 0.1% to 0.2% depending on your trading volume. Please contact us for more details."
    },
    {
      question: "Is BlazeTrade avaliable to trade anytime?",
      answer: "Yes we're round-the-clock available to trade 24/7. "
    },
    {
      question: "Does BlazeTrade respond quickly?",
      answer: "Yes, BlazeTrade responds under 2 minutes and trades your coin in few seconds."
    }
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services and platform.
          </p>
        </div>
        
        <motion.div 
          ref={ref}
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Service Card Component
const ServiceCard = ({ id, icon, title, description, features, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div 
      id={id}
      ref={ref}
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.5,
            delay: index * 0.1
          } 
        }
      }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <FaCheck className="text-accent mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="text-accent hover:text-primary-dark flex items-center font-medium transition-colors duration-300">
        Learn More <FaArrowRight className="ml-2" />
      </button>
    </motion.div>
  );
};

// Pricing Card Component
const PricingCard = ({ name, price, description, features, cta, popular, index }) => {
  return (
    <motion.div 
      className={`rounded-lg overflow-hidden ${popular ? 'border-2 border-accent ring-4 ring-accent ring-opacity-20' : 'border border-gray-200'}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.5,
            delay: index * 0.1
          } 
        }
      }}
    >
      {popular && (
        <div className="bg-accent text-white text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className={`p-6 ${popular ? 'bg-white' : 'bg-gray-50'}`}>
        <h3 className="text-xl font-bold mb-2 text-primary-dark">{name}</h3>
        <div className="flex items-end mb-4">
          <span className="text-4xl font-bold text-primary-dark">{price}</span>
          <span className="text-gray-500 ml-2">{description}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <FaCheck className={`mt-1 mr-2 flex-shrink-0 ${popular ? 'text-accent' : 'text-gray-400'}`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button 
          className={`w-full py-2 rounded-md font-medium transition-colors duration-300 ${popular 
            ? 'bg-accent text-white hover:bg-primary-dark' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          {cta}
        </button>
      </div>
    </motion.div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div 
      className="mb-4 border-b border-gray-200 pb-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.5,
            delay: index * 0.1
          } 
        }
      }}
    >
      <button 
        className="flex justify-between items-center w-full text-left font-semibold text-primary-dark hover:text-accent transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <motion.div 
          className="mt-3 text-gray-600"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Services;