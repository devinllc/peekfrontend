import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState, useRef } from 'react';

const Navigation = ({ isScrolled, heroRef, aboutRef, featuresRef }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className="fixed w-full z-50 bg-black shadow-lg"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <img
              src="/assets/logos.png"
              alt="PeekBI Logo"
              className="h-14 mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/logo.png";
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Features', 'How It Works', 'Pricing', 'Contact'].map((item) => (
              <motion.div
                key={item}
                className="text-lg font-medium text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#7400B8] hover:text-white cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  let targetSection;
                  if (item === 'Home') {
                    targetSection = heroRef?.current;
                  } else if (item === 'About') {
                    targetSection = aboutRef?.current;
                  } else if (item === 'Features') {
                    targetSection = featuresRef?.current;
                  } else if (item === 'How It Works') {
                    const sections = document.querySelectorAll('section');
                    sections.forEach(section => {
                      if (section.textContent.includes('How PeekBI Works')) {
                        targetSection = section;
                      }
                    });
                  } else if (item === 'Pricing') {
                    const sections = document.querySelectorAll('section');
                    sections.forEach(section => {
                      if (section.textContent.includes('Simple, Transparent Pricing')) {
                        targetSection = section;
                      }
                    });
                  } else if (item === 'Contact') {
                    const footerElement = document.querySelector('footer');
                    if (footerElement) targetSection = footerElement;
                  }

                  if (targetSection) {
                    const yOffset = -100;
                    const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="text-white px-7 py-2 rounded-full text-base font-semibold border-2 border-[#9B4DCA] bg-transparent hover:bg-[#F8F4FF] hover:text-[#7400B8] hover:border-[#7400B8] transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-[#9B4DCA]"
              onClick={() => navigate('/login')}
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white px-8 py-2 rounded-full text-base font-semibold shadow-lg hover:from-[#9B4DCA] hover:to-[#C77DFF] hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B4DCA]"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black px-4 py-4 space-y-4">
          {['Home', 'About', 'Features', 'How It Works', 'Pricing', 'Contact'].map((item) => (
            <motion.div
              key={item}
              className="text-lg font-medium text-white px-4 py-3 rounded-lg transition-all duration-300 hover:bg-[#7400B8] hover:text-white cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                let targetSection;
                if (item === 'Home') {
                  targetSection = heroRef?.current;
                } else if (item === 'About') {
                  targetSection = aboutRef?.current;
                } else if (item === 'Features') {
                  targetSection = featuresRef?.current;
                } else if (item === 'How It Works') {
                  const sections = document.querySelectorAll('section');
                  sections.forEach(section => {
                    if (section.textContent.includes('How PeekBI Works')) {
                      targetSection = section;
                    }
                  });
                } else if (item === 'Pricing') {
                  const sections = document.querySelectorAll('section');
                  sections.forEach(section => {
                    if (section.textContent.includes('Simple, Transparent Pricing')) {
                      targetSection = section;
                    }
                  });
                } else if (item === 'Contact') {
                  const footerElement = document.querySelector('footer');
                  if (footerElement) targetSection = footerElement;
                }

                if (targetSection) {
                  const yOffset = -100;
                  const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              {item}
            </motion.div>
          ))}
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full text-[#7400B8] bg-white px-6 py-3 rounded-full text-base font-semibold border-2 border-[#9B4DCA] hover:bg-[#F8F4FF] hover:text-[#7400B8] hover:border-[#7400B8] transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-[#9B4DCA]"
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:from-[#9B4DCA] hover:to-[#C77DFF] hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B4DCA]"
              onClick={() => {
                navigate('/register');
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation; 