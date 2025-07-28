import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheckCircle, FaUsers, FaGlobe, FaShieldAlt, FaAward, FaBitcoin } from 'react-icons/fa';
import neekahImage from '../assets/images/neekah.jpg';

const About = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <AboutHero />
      
      {/* Mission & Vision */}
      <MissionVision />
      
      {/* Core Values */}
      <CoreValues />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* Timeline */}
      <Timeline />
    </div>
  );
};

// About Hero Section
const AboutHero = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BlazeTrade</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your trusted partner in the world of cryptocurrency exchange and trading. 
            Learn about our mission, values, and the team behind BlazeTrade.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Mission & Vision Section
const MissionVision = () => {
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
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
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
          {/* Mission */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="mb-4">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Mission</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary-dark">Making Cryptocurrency Accessible to Everyone</h2>
            <p className="text-gray-600 mb-6">
              At BlazeTrade, our mission is to provide a secure, reliable, and user-friendly platform for cryptocurrency exchange and trading. 
              We aim to bridge the gap between traditional finance and the digital asset economy, making cryptocurrency accessible to everyone 
              regardless of their technical expertise or investment experience.
            </p>
            <ul className="space-y-3">
              {[
                "Providing secure and reliable cryptocurrency services",
                "Offering transparent and competitive fee structures",
                "Delivering exceptional customer support and education",
                "Continuously innovating to improve user experience"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheckCircle className="text-accent mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Vision */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
            }}
            className="bg-gray-50 p-8 rounded-lg border border-gray-100"
          >
            <div className="mb-4">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Vision</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary-dark">Shaping the Future of Digital Finance</h2>
            <p className="text-gray-600 mb-6">
              We envision a world where digital assets are seamlessly integrated into the global financial ecosystem, 
              providing greater financial freedom, security, and opportunity for individuals and businesses worldwide. 
              BlazeTrade aims to be at the forefront of this transformation, setting new standards for excellence in the 
              cryptocurrency industry.
            </p>
            <div className="p-4 bg-white rounded border-l-4 border-accent shadow-sm">
              <p className="italic text-gray-700">
                "Our vision is to create a world where everyone has equal access to the benefits of blockchain technology 
                and cryptocurrency, empowering financial independence and innovation across the globe."
              </p>
              <p className="mt-2 text-sm text-gray-500">— BlazeTrade Founding Team</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Core Values Section
const CoreValues = () => {
  const values = [
    {
      icon: <FaShieldAlt className="text-3xl text-accent" />,
      title: "Security",
      description: "We prioritize the security of our users' assets and data above all else, implementing industry-leading security measures."
    },
    {
      icon: <FaUsers className="text-3xl text-accent" />,
      title: "Transparency",
      description: "We believe in complete transparency in our operations, fee structures, and communications with our users."
    },
    {
      icon: <FaAward className="text-3xl text-accent" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our platform's performance to our customer service."
    },
    {
      icon: <FaGlobe className="text-3xl text-accent" />,
      title: "Accessibility",
      description: "We are committed to making cryptocurrency accessible to everyone, regardless of their background or experience."
    }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Our Core Values</h2>
          <p className="text-lg text-gray-600">
            These principles guide everything we do at BlazeTrade, from product development to customer service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard 
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Team Section
const TeamSection = () => {
  const ambassador = {
    name: "Neekah",
    position: "Brand Ambassador",
    bio: "Neekah is a passionate influential representative of our brand and she's helping to spread awareness and adoption of BlazeTrade's services.",
    image: neekahImage
  };

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
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Meet Our Brand Ambassador</h2>
          <p className="text-lg text-gray-600">
            Our brand ambassador is dedicated to representing BlazeTrade and connecting with our community.
          </p>
        </div>
        
        <motion.div 
          ref={ref}
          className="flex justify-center"
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
          <div className="w-full md:w-2/3 lg:w-1/2">
            <TeamMember 
              name={ambassador.name}
              position={ambassador.position}
              bio={ambassador.bio}
              image={ambassador.image}
              index={0}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Timeline Section
const Timeline = () => {
  const milestones = [
    {
      year: "2019",
      title: "BlazeTradee Founded",
      description: "BlazeTrade was established with a vision to create a secure and accessible cryptocurrency exchange platform."
    },
    {
      year: "2020",
      title: "Brand Launch",
      description: "Our cryptocurrency exchange brand, BlazeTradee, was officially launched, offering Bitcoin and major altcoin trading."
    },
    {
      year: "2021",
      title: "Security Certification",
      description: "BlazeTrade received industry-leading security certifications and implemented enhanced protection measures."
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "We expanded our services to multiple countries, making cryptocurrency trading accessible to more users worldwide."
    },
    {
      year: "2023",
      title: "Advanced Trading Tools",
      description: "Introduced advanced trading tools and features, including buying of giftcards and giftcard redemption."
    },
    {
      year: "2025",
      title: "web App Launch",
      description: "Launched our web application, allowing users to know more about cryptocurrencies and how to trade with BlazeTradee anytime, anywhere."
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Our Journey</h2>
          <p className="text-lg text-gray-600">
            From our founding to the present day, we've been committed to innovation and excellence in cryptocurrency services.
          </p>
        </div>
        
        <motion.div 
          ref={ref}
          className="relative"
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
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
          
          {/* Timeline Items */}
          <div className="space-y-12 relative">
            {milestones.map((milestone, index) => (
              <TimelineItem 
                key={index}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Value Card Component
const ValueCard = ({ icon, title, description, index }) => {
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
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
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
      <div className="w-16 h-16 bg-primary-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Team Member Component
const TeamMember = ({ name, position, bio, image, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
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
      <div className="bg-gray-200">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-auto object-contain"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0A2463&color=fff&size=256`;
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-primary-dark">{name}</h3>
        <p className="text-accent mb-3">{position}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>
    </motion.div>
  );
};

// Timeline Item Component
const TimelineItem = ({ year, title, description, index, isEven }) => {
  return (
    <motion.div 
      className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}
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
      <div className="md:w-1/2"></div>
      <div className="relative flex items-center justify-center md:w-0">
        <div className="h-8 w-8 rounded-full bg-primary-dark text-white flex items-center justify-center z-10">
          <FaBitcoin />
        </div>
      </div>
      <div className="md:w-1/2 pt-4 md:pt-0 md:px-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-sm font-bold text-accent mb-1">{year}</div>
          <h3 className="text-xl font-semibold mb-2 text-primary-dark">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;