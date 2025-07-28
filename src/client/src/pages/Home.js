import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBitcoin, FaChartLine, FaShieldAlt, FaUserTie, FaArrowRight } from 'react-icons/fa';
import bitcoinHero from '../assets/images/bitcoin-icon.png';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        console.log('Fetching user data for ID:', userId);
        const response = await axios.get(`/api/auth/user/${userId}`);
        
        if (response.data && response.data.success && response.data.data) {
          console.log('User data received:', response.data.data);
          setUser({ 
            id: response.data.data._id,
            username: response.data.data.username || 'Trader'
          });
        } else {
          console.warn('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Only show error to user if it's a client-side error (4xx)
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setUser({ username: 'Trader' }); // Fallback to default username
        }
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        // Try different possible locations for the user ID in the token
        const userId = decoded.user?.id || decoded.userId || decoded.sub;
        
        if (userId) {
          fetchUserData(userId);
        } else {
          console.error('No valid user ID found in token');
          setUser({ username: 'Trader' }); // Fallback to default username
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser({ username: 'Trader' }); // Fallback to default username
      }
    }
  }, []);

  return (
    <div className="pt-16">
      {/* Welcome Message for Logged-in Users */}
      {user && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3">
          <div className="container-custom">
            <p className="text-lg font-medium text-left">
              Welcome back, <span className="font-bold">{user.username || 'Trader'}</span>! 👋
            </p>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <HeroSection />

      {/* Instagram CTA Section */}
      <InstagramCTA />

      {/* CTA Section */}
      <CTASection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative bg-primary-dark text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary-light rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-accent rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10 py-20 md:py-32 flex flex-col md:flex-row items-center">
        {/* Hero Content */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Trusted Bitcoin Exchange & Trading Partner
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience secure, professional, and reliable cryptocurrency trading with BlazeTrade. We make Bitcoin trading accessible for everyone.
          </motion.p>
          
          <motion.div 
            className="flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a 
              href="https://wa.me/2348163309355"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center text-lg px-8 py-3"
            >
              Trade With Us Now <FaArrowRight className="ml-2" />
            </a>
          </motion.div>
        </div>
        
        {/* Hero Image */}
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-accent rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
            <motion.div
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="relative z-10"
            >
              <img src={bitcoinHero} alt="Bitcoin" className="w-64 h-64 md:w-80 md:h-80" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section Component with Scroll Animation
const FeaturesSection = () => {
  const features = [
    {
      icon: <FaBitcoin className="text-4xl text-yellow-500" />,
      title: "Secure Bitcoin Exchange",
      description: "Trade Bitcoin and other cryptocurrencies on our secure and reliable exchange platform."
    },
    {
      icon: <FaChartLine className="text-4xl text-accent" />,
      title: "Advanced Trading Tools",
      description: "Access professional trading tools and real-time market data for informed decisions."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: "Maximum Security",
      description: "Your assets are protected with industry-leading security measures and encryption."
    },
    {
      icon: <FaUserTie className="text-4xl text-purple-500" />,
      title: "Expert Support",
      description: "Our team of cryptocurrency experts is available 24/7 to assist you with any questions."
    }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <SectionHeader 
          title="Why Choose BlazeTrade" 
          subtitle="We provide the best cryptocurrency trading experience with security, reliability, and professional service."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section Component
const ServicesSection = () => {
  const services = [
    {
      title: "Bitcoin Exchange",
      description: "Buy and sell Bitcoin and other cryptocurrencies with competitive rates and low fees.",
      link: "/services#bitcoin-exchange"
    },
    {
      title: "Crypto Trading",
      description: "Trade cryptocurrencies with advanced tools, charts, and market analysis.",
      link: "/services#crypto-trading"
    },
    {
      title: "Market Analysis",
      description: "Get detailed market insights and analysis to make informed trading decisions.",
      link: "/services#market-analysis"
    },
    {
      title: "Portfolio Management",
      description: "Professional management of your cryptocurrency portfolio for optimal returns.",
      link: "/services#portfolio-management"
    },
    {
      title: "Security Solutions",
      description: "Advanced security solutions to protect your digital assets and investments.",
      link: "/services#security-solutions"
    },
    {
      title: "Consulting Services",
      description: "Expert consulting services for individuals and businesses entering the crypto space.",
      link: "/services#consulting"
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <SectionHeader 
          title="Our Services" 
          subtitle="Comprehensive cryptocurrency services tailored to your needs"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              link={service.link}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "$250M+", label: "Monthly Volume" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

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
    <section className="py-16 bg-primary-dark text-white">
      <div className="container-custom">
        <motion.div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
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
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
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
    <section className="section bg-gray-50">
      <div className="container-custom">
        <motion.div 
          ref={ref}
          className="bg-primary-dark rounded-2xl p-8 md:p-12 text-white text-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to trade?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Hit the link below to start trading your cryptocurrencies with Blaze Trade.
          </p>
          <a 
            href="https://wa.me/2348163309355" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center btn-primary text-lg px-8 py-3"
          >
            Trade Now <FaArrowRight className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Reusable Section Header Component
const SectionHeader = ({ title, subtitle }) => {
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
    <motion.div 
      ref={ref}
      className="text-center max-w-3xl mx-auto"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">{title}</h2>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </motion.div>
  );
};

// Feature Card Component with Animation
const FeatureCard = ({ icon, title, description, index }) => {
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
      ref={ref}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
      <h3 className="text-xl font-semibold mb-2 text-primary-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Service Card Component with Animation
const ServiceCard = ({ title, description, link, index }) => {
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
      ref={ref}
      className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300 border border-gray-100"
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
      <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        to={link} 
        className="text-accent hover:text-primary-dark flex items-center font-medium transition-colors duration-300"
      >
        Learn More <FaArrowRight className="ml-2" />
      </Link>
    </motion.div>
  );
};

// Instagram CTA Section
const InstagramCTA = () => {
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
    <section className="section bg-white">
      <div className="container-custom">
        <motion.div 
          ref={ref}
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Follow Us on Instagram</h2>
          <p className="text-lg text-gray-600 mb-8">
            Stay up-to-date with the latest news, offers, and trading tips by following our official Instagram page.
          </p>
          <a 
            href="https://instagram.com/blaze__trade?igsh=M3Y4cmhoNXRO" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center btn-secondary text-lg px-8 py-3"
          >
            @blaze__trade
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;