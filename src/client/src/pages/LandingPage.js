import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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

  const marketData = [
    { name: 'DOGE Index', price: '$0.25173', change: '+0.01197', percent: '+4.75%' },
    { name: 'SUSHI Index', price: '$0.965', change: '+0.036', percent: '+3.77%' },
    { name: 'MASK Index', price: '$1.476', change: '+0.028', percent: '+1.88%' },
    { name: 'UNI Index', price: '$10.258', change: '+0.057', percent: '+0.55%' },
  ];

  return (
    <div className="bg-blue-950 text-white min-h-screen font-sans">
      <main className="container-custom pt-32 pb-16">
        {/* Hero Section */}
        <AnimatedSection>
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Trade Crypto
                <br />
                <span className="text-blue-400">Like a Pro.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Join the next generation of trading. BlazeTrade offers institutional-grade tools in a simple, intuitive package.
              </p>

              <form onSubmit={handleJoin} className="mt-8 flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email/Phone Number"
                  className="flex-grow bg-blue-900 border border-blue-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-8 py-3 transition duration-300 flex items-center justify-center gap-2">
                  Join Us
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

              </form>
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

        {/* Market Ticker Section */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {marketData.map((item, index) => (
              <div key={index} className="bg-blue-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{item.name}</p>
                <p className="text-2xl font-bold mt-1">{item.price}</p>
                <div className="flex justify-center items-center mt-1 text-sm">
                  <span className="text-green-400 mr-2">{item.change}</span>
                  <span className="text-gray-400">({item.percent})</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Services Section */}
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-4xl font-bold">Leading the Expansion of Altcoin Markets</h2>
            <p className="mt-4 text-lg text-blue-200">Everything you need for a seamless trading experience.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-blue-900 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition duration-300">
                <h3 className="text-2xl font-bold">Secure Wallet</h3>
                <p className="mt-2 text-blue-200">State-of-the-art security for your digital assets.</p>
              </div>
              <div className="bg-blue-900 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition duration-300">
                <h3 className="text-2xl font-bold">Advanced Charting</h3>
                <p className="mt-2 text-blue-200">Powerful tools and indicators to inform your trades.</p>
              </div>
              <div className="bg-blue-900 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition duration-300">
                <h3 className="text-2xl font-bold">Real-time Pricing</h3>
                <p className="mt-2 text-blue-200">Standardised, real-time pricing across all markets.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Promo Cards Section */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-900 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition duration-300">
              <h3 className="text-2xl font-bold">Support New Listings</h3>
              <p className="mt-2 text-blue-200">Be the first to trade promising new assets. Let's get them listed on BlazeTrade!</p>
              <Link to="/services" className="mt-4 inline-block text-blue-400 font-semibold hover:text-blue-300">Join Now &rarr;</Link>
            </div>
            <div className="bg-blue-900 border border-blue-800 rounded-xl p-8 hover:border-blue-500/50 transition duration-300">
              <h3 className="text-2xl font-bold">Exclusive Referral Bonuses</h3>
              <p className="mt-2 text-blue-200">Receive an exclusive merchandise package and enjoy top-tier referral bonuses when you invite friends.</p>
              <Link to="/signup" className="mt-4 inline-block text-blue-400 font-semibold hover:text-blue-300">Join Now &rarr;</Link>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
