import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp } from 'react-icons/fa';
import heroImage from '../assets/crypto-images.png';
import LandingPageFooter from '../components/LandingPageFooter';

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      className="mt-24"
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const [tickerItems, setTickerItems] = useState([
    { name: 'Bitcoin (BTC)', price: '$42,850', change: '+1,250', percent: '+3.01%' },
    { name: 'Ethereum (ETH)', price: '$2,350', change: '+45.60', percent: '+1.98%' },
    { name: 'Tether (USDT)', price: '$1.00', change: '+0.001', percent: '+0.10%' },
    { name: 'Litecoin (LTC)', price: '$75.20', change: '+1.35', percent: '+1.83%' },
  ]);

  return (
    <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white min-h-screen font-sans">
      <main className="container-custom pt-24 pb-16">
        {/* Hero Section */}
        <AnimatedSection>
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                The Future of <span className="text-blue-400">Crypto Trading</span> is Here
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                Experience lightning-fast trades, top-tier security, and institutional-grade tools—all in one powerful platform.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl px-8 py-4 transition duration-300 flex items-center justify-center gap-2"
                >
                  Get Started for Free
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent hover:bg-blue-900/50 border-2 border-blue-600 text-blue-100 text-lg font-bold rounded-xl px-8 py-4 transition duration-300 flex items-center justify-center gap-2"
                >
                  Sign In
                </Link>
              </div>
              
              <div className="mt-8 flex items-center space-x-4 text-sm text-blue-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-blue-700 border-2 border-blue-800"></div>
                  ))}
                </div>
                <p>Join <span className="font-bold text-white">10,000+</span> traders on BlazeTrade</p>
              </div>
            </motion.div>
            <motion.div
              className="mt-12 md:mt-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src={heroImage} alt="BlazeTrade Services" className="rounded-2xl shadow-2xl shadow-blue-500/20" />
            </motion.div>
          </section>
        </AnimatedSection>

        {/* Social Media Section */}
        <AnimatedSection>
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Join Our Growing Community</h3>
            <p className="text-blue-200 mb-8 text-lg">
              Stay updated with the latest news, market insights, and exclusive offers. Follow us on social media or reach out directly via WhatsApp for immediate assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://www.facebook.com/share/1CZvtKCKad/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://x.com/blaze__trade?s=21&t=2UqGnv0T5B_fMjkwyAIrnw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/blaze__trade/?igsh=M3Y4cmhoNXRO" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://wa.me/2348163309355" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-green-500 transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-8 h-8" />
              </a>
            </div>
            <p className="mt-8 text-blue-300 text-sm">
              Need help? Our support team is just a message away on any of these platforms.
            </p>
          </div>
        </AnimatedSection>

        {/* Market Ticker Section */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {tickerItems.map((item, index) => (
              <div key={index} className="bg-blue-900/50 p-4 rounded-lg hover:bg-blue-800/50 transition-colors duration-300">
                <p className="text-sm text-gray-400">{item.name}</p>
                <p className="text-2xl font-bold mt-1">{item.price}</p>
                <div className="flex justify-center items-center mt-1 text-sm">
                  <span className="text-green-400 mr-2">{item.change}</span>
                  <span className="text-gray-400">{item.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Why BlazeTrade Section */}
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-4xl font-bold">Why Choose BlazeTrade?</h2>
            <p className="mt-4 text-xl text-blue-200 max-w-3xl mx-auto">Experience the difference with a platform built by traders, for traders.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="h-12 w-12 bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Bank-Grade Security</h3>
                <p className="mt-3 text-blue-200">Your assets are protected with military-grade encryption, multi-signature wallets, and cold storage solutions.</p>
              </div>
              <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="h-12 w-12 bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Advanced Charting</h3>
                <p className="mt-3 text-blue-200">Access professional trading tools with real-time data, technical indicators, and drawing tools to analyze market trends.</p>
              </div>
              <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="h-12 w-12 bg-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Lightning-Fast Trades</h3>
                <p className="mt-3 text-blue-200">Execute trades in milliseconds with our high-performance matching engine and low-latency infrastructure.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <div className="mt-24 text-center">
            <h2 className="text-4xl font-bold">Ready to Start Trading?</h2>
            <p className="mt-4 text-xl text-blue-200 max-w-2xl mx-auto">Join thousands of traders who trust BlazeTrade for their cryptocurrency investments.</p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl px-8 py-4 transition duration-300 flex items-center justify-center gap-2"
              >
                Create Free Account
              </Link>
              <Link 
                to="/login" 
                className="bg-transparent hover:bg-blue-900/50 border-2 border-blue-600 text-blue-100 text-lg font-bold rounded-xl px-8 py-4 transition duration-300 flex items-center justify-center gap-2"
              >
                Sign In to Dashboard
              </Link>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <h3 className="text-2xl font-bold mb-4">New to Crypto?</h3>
                <p className="text-blue-200 mb-6">Start your journey with our easy-to-use platform and educational resources designed for beginners.</p>
                <Link to="/learn" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center">
                  Learn the Basics 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <h3 className="text-2xl font-bold mb-4">Advanced Trading Tools</h3>
                <p className="text-blue-200 mb-6">Access professional trading features, including margin trading, futures, and advanced order types.</p>
                <Link to="/features" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center">
                  Explore Features 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
