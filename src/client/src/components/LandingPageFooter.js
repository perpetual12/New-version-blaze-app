import React from 'react';
import { FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const LandingPageFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white py-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-3">
              <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="w-7 h-7 rounded" />
              <span className="text-2xl font-bold">BlazeTrade</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Your trusted partner for Bitcoin exchange and trading services.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-2" />
                <a href="mailto:support@blazetrade.com" className="hover:text-accent">support@blazetrade.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaPhone className="mr-2" />
                <a href="tel:+2348163309355" className="hover:text-accent">+234 816 330 9355</a>
              </li>
            </ul>
          </div>

          {/* Location & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Find Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
            </ul>
            <div className="mt-4">
                <a href="https://instagram.com/blaze__trade?igsh=M3Y4cmhoNXRO" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-300 hover:text-accent">
                    <FaInstagram className="mr-2" />
                    @blaze__trade
                </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} BlazeTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
