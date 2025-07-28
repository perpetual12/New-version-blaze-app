import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaInstagram } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';

const Contact = () => {

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <ContactHero />
      
      {/* Contact Form and Info */}
      <ContactSection />
      
      {/* Map Section */}
      <MapSection />
      
      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
};

// Contact Hero Section
const ContactHero = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 mb-8">
            Have questions about our Bitcoin exchange and trading services? 
            Our team is here to help. Reach out to us using the contact information below.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Form and Info Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const whatsappMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/2348163309355?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Optional: Show a success message
    setFormStatus({
      submitted: true,
      success: true,
      message: 'You will be redirected to WhatsApp to send your message.'
    });

    // Reset form status after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };

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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
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
          {/* Contact Form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl font-bold mb-6 text-primary-dark">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent text-gray-900"
                  required
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="btn-primary flex items-center justify-center w-full"
                >
                  Send Message <FaPaperPlane className="ml-2" />
                </button>
              </div>
              
              {formStatus.submitted && (
                <motion.div 
                  className={`p-4 rounded-md ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {formStatus.message}
                </motion.div>
              )}
            </form>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
          >
            <h2 className="text-3xl font-bold mb-6 text-primary-dark">Contact Information</h2>
            <p className="text-gray-600 mb-8">
              You can reach out to us through the following channels. Our support team is available 24/7 to assist you.
            </p>
            
            <div className="space-y-6">
              <ContactInfoItem 
                icon={<FaEnvelope className="text-primary-dark" />}
                title="Email Us"
                content="support@blazetrade.com"
                link="mailto:support@blazetrade.com"
              />
              
              <ContactInfoItem 
                icon={<FaPhone className="text-accent" />}
                title="Phone"
                content="+234 816 330 9355"
                link="tel:+2348163309355"
              />
              
              <ContactInfoItem 
                icon={<FaMapMarkerAlt className="text-accent" />}
                title="Address"
                content="Victoria island, Lagos, Nigeria, 101241"
                link="https://maps.google.com/?q=Victoria+island,+Lagos,+Nigeria"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-primary-dark">Follow Us</h3>
              <div className="flex space-x-4">
                <SocialLink icon={<FaInstagram />} href="https://instagram.com/blaze__trade?igsh=M3Y4cmhoNXRO" />
                
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-primary-dark">Business Hours</h3>
              <p className="text-gray-600 mb-4">Our support team is available 24/7</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Map Section
const MapSection = () => {
  return (
    <section className="section bg-gray-50 py-0">
      <div className="h-96 bg-gray-300 w-full">
        {/* In a real application, you would embed a Google Map or other map service here */}
        <div className="w-full h-full flex items-center justify-center bg-primary-dark bg-opacity-10">
          <div className="text-center">
            <FaMapMarkerAlt className="text-5xl text-primary-dark mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-dark">Bblazetrade Headquarters</h3>
            <p className="text-gray-600">Victoria island, Lagos, Nigeria, 101241</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact CTA Section
const ContactCTA = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-dark">Ready to Start Trading?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of traders who trust Blazetrade for their cryptocurrency exchange and trading needs.
            Sign up today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="https://wa.me/2348163309355" target="_blank" rel="noopener noreferrer" className="btn-primary">Chat with us</a>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Info Item Component
const ContactInfoItem = ({ icon, title, content, link }) => {
  return (
    <div className="flex items-start">
      <div className="w-10 h-10 rounded-full bg-primary-dark bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-primary-dark">{title}</h3>
        <a 
          href={link} 
          className="text-gray-600 hover:text-accent transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      </div>
    </div>
  );
};

// Social Link Component
const SocialLink = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-primary-dark bg-opacity-10 flex items-center justify-center hover:bg-primary-dark hover:text-white transition-all duration-300 text-primary-dark"
    >
      {icon}
    </a>
  );
};

export default Contact;