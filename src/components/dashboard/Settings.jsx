import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiCode, FiGitBranch, FiUser, FiCpu, FiShield,FiHeart, FiArrowRight } from 'react-icons/fi';
import Header from './Header';

const Settings = () => {
    const appVersion = '1.0.0'; 

    return (
        <div className="h-full flex flex-col">
            <Header
                title="Settings"
                description="Application and developer information"
                icon={FiInfo}
            />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* App Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FiInfo className="w-6 h-6 text-[#7400B8]" />
                            <span>Application Information</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                                <span className="font-medium text-gray-600 flex items-center gap-2"><FiGitBranch /> App Version</span>
                                <span className="font-semibold text-gray-800">{appVersion}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                                <span className="font-medium text-gray-600 flex items-center gap-2"><FiCode /> Framework</span>
                                <span className="font-semibold text-gray-800">React.js</span>
                            </div>
                             <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                                <span className="font-medium text-gray-600 flex items-center gap-2"><FiCpu /> Analytics Engine</span>
                                <span className="font-semibold text-gray-800">Google Gemini</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Legal & Privacy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FiShield className="w-6 h-6 text-[#7400B8]" />
                            <span>Legal & Privacy</span>
                        </h3>
                        <div className="space-y-4">
                            <a href="#" className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200">
                                <span className="font-medium text-gray-600">Privacy Policy</span>
                                <FiArrowRight className="w-5 h-5 text-gray-400" />
                            </a>
                            <a href="#" className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200">
                                <span className="font-medium text-gray-600">Terms of Service</span>
                                <FiArrowRight className="w-5 h-5 text-gray-400" />
                            </a>
                        </div>
                    </motion.div>
                     {/* Acknowledgments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FiHeart className="w-6 h-6 text-[#7400B8]" />
                            <span>Acknowledgments</span>
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Special thanks to the open-source community and all contributors who have made this project possible. 
                            This application is built with modern web technologies and powered by cutting-edge AI analytics.
                        </p>
                    </motion.div>

                    {/* Copyright Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center py-8 border-t border-gray-200/50"
                    >
                        <p className="text-sm text-gray-600 mb-2">
                            © 2024 PeekBI. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500">
                            Designed and Developed by{' '}
                            <a 
                                href="https://ufdevs.me" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#7400B8] hover:text-[#9B4DCA] transition-colors duration-200 font-medium"
                            >
                                ufdevs.me
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 