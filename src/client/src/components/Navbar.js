import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

    return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-950 shadow-lg py-3' : 'bg-blue-950/50 backdrop-blur-sm py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="h-8 object-contain" />
          <span className="text-xl font-bold text-white">BlazeTrade</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {token ? (
            <>
              <NavLink to="/dashboard" label="Home" />
              <NavLink to="/about" label="About" />
              <NavLink to="/services" label="Services" />
              <NavLink to="/contact" label="Contact" />
              <button onClick={handleLogout} className="text-white hover:text-blue-300 transition duration-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" label="Home" />
              <NavLink to="/login" label="Login" />
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {!token && (
            <Link to="/login" className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
              Login
            </Link>
          )}
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-blue-900"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-custom py-4 flex flex-col space-y-4">
            {token ? (
              <>
                <MobileNavLink to="/dashboard" label="Home" onClick={toggleMenu} />
                <MobileNavLink to="/about" label="About" onClick={toggleMenu} />
                <MobileNavLink to="/services" label="Services" onClick={toggleMenu} />
                <MobileNavLink to="/contact" label="Contact" onClick={toggleMenu} />
                <button 
                  onClick={() => { handleLogout(); toggleMenu(); }} 
                  className="text-white hover:text-blue-300 py-2 block text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/" label="Home" onClick={toggleMenu} />
                <MobileNavLink to="/login" label="Login" onClick={toggleMenu} />
                <MobileNavLink to="/signup" label="Sign Up" onClick={toggleMenu} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`text-white hover:text-blue-300 transition duration-300 ${isActive ? 'text-blue-300' : ''}`}>
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`py-2 block transition duration-300 ${isActive ? 'text-blue-300' : 'text-white'} hover:text-blue-300`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;