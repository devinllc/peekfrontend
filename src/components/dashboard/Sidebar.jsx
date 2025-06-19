import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome, FiSettings, FiUser, FiBarChart2,
    FiPieChart, FiTrendingUp, FiLogOut, FiMenu, FiX, FiChevronLeft, FiChevronRight, FiDatabase, FiUpload
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleProfileClick = () => {
        navigate('/user/profile');
    };

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            logout();
        } catch (err) {
            console.error('Logout error:', err);
            window.location.href = '/';
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        {
            path: '/user/dashboard',
            icon: <FiHome className="w-5 h-5" />,
            label: 'Dashboard',
            description: 'Overview & Analytics'
        },
        {
            path: '/user/data-sources',
            icon: <FiDatabase className="w-5 h-5" />,
            label: 'Data Sources',
            description: 'Manage Files'
        },
        {
            path: '/user/data-upload',
            icon: <FiUpload className="w-5 h-5" />,
            label: 'Upload Data',
            description: 'Add New Files'
        }
    ];

    return (
        <>
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl text-gray-700 hover:text-[#7400B8] transition-all duration-200 border border-white/30"
                >
                    {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </motion.button>
            </div>

            {/* Sidebar */}
            <motion.div
                className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] shadow-2xl transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'w-72' : 'w-20'
                }`}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Toggle */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-white/20">
                        {sidebarOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                                    <FiBarChart2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        PeekBI
                                    </h1>
                                    <p className="text-xs text-white/80">Analytics Platform</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm mx-auto"
                            >
                                <FiBarChart2 className="w-6 h-6 text-white" />
                            </motion.div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-xl text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
                        >
                            {sidebarOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
                        </motion.button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={item.path}
                                    className={`group flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
                                        isActive(item.path) 
                                            ? 'bg-white/20 text-white shadow-xl backdrop-blur-sm' 
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                        isActive(item.path) 
                                            ? 'bg-white/20' 
                                            : 'bg-white/10 group-hover:bg-white/20'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    {sidebarOpen && (
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold text-sm">{item.label}</p>
                                            <p className={`text-xs ${
                                                isActive(item.path) ? 'text-white/90' : 'text-white/60'
                                            }`}>
                                                {item.description}
                                            </p>
                                        </div>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-white/20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link
                                to="/user/profile"
                                className={`flex items-center p-4 rounded-2xl transition-all duration-300 ${
                                    isActive('/user/profile') 
                                        ? 'bg-white/20 text-white shadow-xl backdrop-blur-sm' 
                                        : 'hover:bg-white/10 hover:text-white text-white/80'
                                } ${!sidebarOpen ? 'justify-center' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shadow-lg backdrop-blur-sm text-lg flex-shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                {sidebarOpen && (
                                    <div className="ml-4 flex-1">
                                        <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                                        <p className="text-xs text-white/60">{user?.email || 'user@example.com'}</p>
                                    </div>
                                )}
                            </Link>
                        </motion.div>

                        {/* Settings and Logout */}
                        <div className="mt-4 space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <a
                                    href="#"
                                    className={`flex items-center px-4 py-3 text-sm text-white/80 rounded-2xl hover:bg-white/10 hover:text-white transition-all duration-300 ${!sidebarOpen ? 'justify-center' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <FiSettings className="w-5 h-5" />
                                    </div>
                                    {sidebarOpen && <span className="ml-4 font-medium">Settings</span>}
                                </a>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <a
                                    href="#"
                                    onClick={handleLogout}
                                    className={`flex items-center px-4 py-3 text-sm text-white/80 rounded-2xl hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 ${!sidebarOpen ? 'justify-center' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <FiLogOut className="w-5 h-5" />
                                    </div>
                                    {sidebarOpen && <span className="ml-4 font-medium">Logout</span>}
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;