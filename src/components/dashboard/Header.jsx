import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ 
    title, 
    description, 
    icon: Icon, 
    actionButton = null,
    className = ""
}) => {
    return (
        <div className={`bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] p-8 text-white shadow-xl ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-white/80">{description}</p>
                    </div>
                </div>
                
                {/* Handle actionButton whether it's a React element or an object with properties */}
                {actionButton && (
                    React.isValidElement(actionButton) 
                    ? actionButton 
                    : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={actionButton.onClick}
                            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-200"
                        >
                            {actionButton.icon && <actionButton.icon className="w-5 h-5" />}
                            <span className="font-medium">{actionButton.label}</span>
                        </motion.button>
                    )
                )}
            </div>
        </div>
    );
};

export default Header; 