import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiTrendingUp, FiShield, FiPlay } from 'react-icons/fi';
import { forwardRef, useEffect, useRef } from 'react';

const HeroSection = forwardRef((props, heroRef) => {
  return (
    <section ref={heroRef} className="min-h-screen flex items-center pt-24 sm:pt-24 pb-6 sm:pb-10 px-3 sm:px-6">
      <div className="max-w-[1200px] mx-auto w-full h-full">
        <div className="bg-gradient-to-br from-[#2D1B69] to-[#4C2A85] rounded-3xl px-4 sm:px-8 pt-6 sm:pt-8 pb-0 lg:pt-10 lg:px-10 shadow-2xl border border-[#7400B8]/20 h-full flex flex-col">
          {/* Text Content - Top */}
          <div className="text-center mb-4 sm:mb-8 flex-shrink-0">
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-[#9B4DCA] to-[#F8F4FF] bg-clip-text text-transparent">Uncover Patterns. Unlock Growth.</span>
            </motion.h1>
            
            <motion.p 
              className="hidden sm:block text-base lg:text-lg text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
             Advanced Analytics-Powerful insights with machine learning algorithms. <br />
             Real-time Monitoring-Track performance and trends in real-time. <br />
             Secure & Reliable-Enterprise-grade security for your data. 
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-xl hover:shadow-xl transition-all duration-200 text-base font-medium flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
              </Link>
              <Link
                to="#demo"
                className="w-full sm:w-auto px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 hover:shadow-xl transition-all duration-200 text-base font-medium flex items-center justify-center space-x-2"
              >
                <FiPlay className="w-4 h-4" />
                <span>Watch Demo</span>
              </Link>
            </motion.div>
          </div>


          {/* Image - Takes remaining height */}
          <motion.div 
            className="relative flex justify-center flex-1 min-h-0 overflow-hidden sm:mt-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/assets/hero.png"
                alt="PeekBI Analytics Dashboard"
                className="w-full h-[45vh] sm:h-[62vh] object-contain sm:object-cover object-center sm:object-top rounded-xl border-2 border-[#7400B8]/30 shadow-2xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/1200x600/2D1B69/white?text=PeekBI+Analytics";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/20 to-transparent rounded-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection; 