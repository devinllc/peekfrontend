import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiCalendar, FiShield, FiDatabase, FiCreditCard, FiCheck, FiX, FiEdit, FiSave, FiLoader, FiPhone, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './Header';

const API_BASE_URL = 'https://api.peekbi.com';

const Profile = () => {
    const { user: authUser, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({});

    const formatLastLogin = (lastLogin) => {
        if (!lastLogin) return 'Never';
        const date = new Date(lastLogin);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!authUser?.id && !authUser?._id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const userId = authUser?.id || authUser?._id;
                const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success' && response.data.user) {
                    setUser(response.data.user);
                    setFormData(response.data.user);
                } else {
                    // Fallback to authUser if API doesn't return expected data
                    setUser(authUser);
                    setFormData(authUser);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                // Fallback to authUser if fetch fails
                setUser(authUser);
                setFormData(authUser);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []); // Empty dependency array - only run once on mount

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(user || {});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            
            // Get the user ID from authUser, checking both id and _id properties
            const userId = authUser?.id || authUser?._id;
            
            if (!userId) {
                throw new Error('User ID is required');
            }

            console.log('Submitting form data:', formData);
            
            // Ensure we're sending the right fields in the right format
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                userType: formData.userType,
                category: formData.bussinessCategory,
                businessType: formData.bussinessType,
                phone: formData.phone,
                companyName: formData.companyName
            };

            console.log('Sending update data:', dataToSend);

            // Use updateProfile from AuthContext instead of direct axios call
            const result = await updateProfile(userId, dataToSend);
            console.log('Update profile result:', result);

            if (result && result.success) {
                if (result.user) {
                    // If user data is returned, use it
                    console.log('Updated profile data:', result.user);
                    setUser(result.user);
                    setIsEditing(false);
                } else {
                    setError('Update successful but no user data returned');
                }
            } else {
                setError(result?.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5 p-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center">
                                    <FiLoader className="w-8 h-8 text-white animate-spin" />
                                </div>
                                <p className="text-gray-600 font-medium">Loading profile...</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5 p-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiX className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5 p-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
                    >
                        <div className="flex items-center justify-center h-64">
                <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUser className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Profile Data</h3>
                                <p className="text-gray-600">Unable to load user profile data</p>
                    <button
                        onClick={() => navigate('/user/dashboard')}
                                    className="mt-4 px-4 py-2 bg-[#7400B8] text-white rounded-xl"
                    >
                        Return to Dashboard
                    </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
                {/* Header */}
            <Header
                title="Profile"
                description="Manage your account information"
                icon={FiUser}
                actionButton={
                    !isEditing && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEdit}
                            className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 border border-white/30"
                        >
                            <FiEdit className="w-5 h-5" />
                            <span>Edit Profile</span>
                        </motion.button>
                    )
                }
            />

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">User Type</label>
                                        <select
                                            name="userType"
                                            value={formData.userType || 'individual'}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="business">Business</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Business Category</label>
                                        <select
                                            name="bussinessCategory"
                                            value={formData.bussinessCategory}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="healthcare">Healthcare</option>
                                            <option value="technology">Technology</option>
                                            <option value="education">Education</option>
                                            <option value="retail">Retail</option>
                                            <option value="manufacturing">Manufacturing</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Business Type</label>
                                        <select
                                            name="bussinessType"
                                            value={formData.bussinessType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="B2B">B2B</option>
                                            <option value="B2C">B2C</option>
                                            <option value="C2C">C2C</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Phone</label>
                                        <input
                                            type="number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 pt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-xl hover:from-[#9B4DCA] hover:to-[#C77DFF] transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <FiLoader className="w-5 h-5 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="w-5 h-5" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        ) : (
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiUser className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Name</p>
                                        <p className="font-semibold text-gray-800">{user.name || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiMail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Email</p>
                                        <p className="font-semibold text-gray-800">{user.email || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiCalendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Created At</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiShield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Subscription Status</p>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {user.subscriptionStataus || 'N/A'}
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiDatabase className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Business Category</p>
                                        <p className="font-semibold text-gray-800 capitalize">{user.bussinessCategory || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiShield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Business Type</p>
                                        <p className="font-semibold text-gray-800">{user.bussinessType || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiPhone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Phone</p>
                                        <p className="font-semibold text-gray-800">{user.phone || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiShield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">User Type</p>
                                        <p className="font-semibold text-gray-800 capitalize">{user.userType || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="flex items-center space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                        <FiBriefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Company Name</p>
                                        <p className="font-semibold text-gray-800">{user.companyName || 'N/A'}</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="md:col-span-2 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                            <FiCalendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                            <p className="text-sm text-gray-600 font-medium">Login History</p>
                                            <p className="font-semibold text-gray-800">
                                                Recent logins ({Array.isArray(user.lastLogin) ? user.lastLogin.length : 0})
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {Array.isArray(user.lastLogin) && user.lastLogin.length > 0 ? (
                                        <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50/80 text-gray-700">
                                                    <tr>
                                                        <th className="py-2 px-4 text-left">#</th>
                                                        <th className="py-2 px-4 text-left">Date</th>
                                                        <th className="py-2 px-4 text-left">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {user.lastLogin.map((login, index) => {
                                                        const date = new Date(login);
                                                        return (
                                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                                <td className="py-2 px-4">{index + 1}</td>
                                                                <td className="py-2 px-4">{date.toLocaleDateString()}</td>
                                                                <td className="py-2 px-4">{date.toLocaleTimeString()}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No login history available</p>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </div>

                    {/* Subscription Plan */}
                    <div className="border-t border-gray-200/50 p-8 bg-gradient-to-r from-[#7400B8]/5 to-[#9B4DCA]/5 rounded-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center space-x-3">
                                        <FiCreditCard className="w-8 h-8 text-[#7400B8]" />
                            <span>Subscription Plan</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div 
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                                        <FiCreditCard className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800 capitalize">
                                            {user?.plan?.name || 'free'} Plan
                                        </h4>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {user?.subscriptionStataus || 'inactive'}
                                        </p>
                                    </div>
                                </div>
                                <dl className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                                        <dt className="text-gray-600 font-medium">Max Reports</dt>
                                        <dd className="font-bold text-gray-800">{user?.plan?.maxReports || 0}</dd>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                                        <dt className="text-gray-600 font-medium">Max Saved Charts</dt>
                                        <dd className="font-bold text-gray-800">{user?.plan?.maxSavedCharts || 0}</dd>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                                        <dt className="text-gray-600 font-medium">Max Users</dt>
                                        <dd className="font-bold text-gray-800">{user?.plan?.maxUsersPerAccount || 1}</dd>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                                        <dt className="text-gray-600 font-medium">Data Retention</dt>
                                        <dd className="font-bold text-gray-800">{user?.plan?.dataRetentionDays || 30} days</dd>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl">
                                        <dt className="text-gray-600 font-medium">Billing Interval</dt>
                                        <dd className="font-bold text-gray-800 capitalize">{user?.plan?.billingInterval || 'Monthly'}</dd>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 rounded-xl">
                                        <dt className="text-gray-700 font-bold">Price</dt>
                                        <dd className="font-bold text-[#7400B8]">${user?.plan?.price || 0}/month</dd>
                                    </div>
                                </dl>
                            </motion.div>

                            <motion.div 
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h4 className="font-bold text-gray-800 mb-6 text-lg">Plan Features</h4>
                                <ul className="space-y-4 text-sm">
                                    {user?.plan?.features && Object.entries(user.plan.features).map(([feature, enabled], index) => (
                                        <motion.li 
                                            key={feature} 
                                            className="flex items-center space-x-3 p-3 rounded-xl"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {enabled ?
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <FiCheck className="w-4 h-4 text-white" />
                                                </div> :
                                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                    <FiX className="w-4 h-4 text-white" />
                                                </div>
                                            }
                                            <span className={`font-medium ${enabled ? "text-gray-800" : "text-gray-500"}`}>
                                                {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Usage Statistics */}
                        <motion.div 
                            className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg"
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="font-bold text-gray-800 mb-6 text-lg">Usage Statistics</h4>
                            <dl className="grid grid-cols-2 gap-6 text-sm">
                                <div className="p-4 bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 rounded-xl">
                                    <dt className="text-gray-600 font-medium mb-2">Reports Created</dt>
                                    <dd className="font-bold text-2xl text-[#7400B8]">{user?.repoerCount || 0}</dd>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 rounded-xl">
                                    <dt className="text-gray-600 font-medium mb-2">Charts Created</dt>
                                    <dd className="font-bold text-2xl text-[#7400B8]">{user?.chartCount || 0}</dd>
                                </div>
                            </dl>
                        </motion.div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #7400B8;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9B4DCA;
                }
            `}</style>
        </div>
    );
};

export default Profile; 