import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiCpu, FiDownload, FiCalendar, FiFile, FiDatabase, FiBarChart2, FiCheck, FiLoader, FiFileText, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

const DataSources = () => {
    const navigate = useNavigate();
    const { user, getAllUserFiles } = useAuth();
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFiles = async () => {
        if (!user?._id) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const result = await getAllUserFiles(user._id);
            if (result.success && result.data?.files) {
                const sortedFiles = result.data.files.sort((a, b) => 
                    new Date(b.uploadedAt) - new Date(a.uploadedAt)
                );
                setFiles(sortedFiles);
            } else {
                setError(result.error || "Error fetching files");
            }
        } catch (err) {
            setError(err.message || "Error fetching files");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user?._id, getAllUserFiles]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (file.analysis) {
            navigate(`/user/dashboard?fileId=${file._id}`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <Header
                title="Data Sources"
                description="Manage and analyze your uploaded data files"
                icon={FiDatabase}
                actionButton={
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/user/data-upload')}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 border border-white/30"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Upload New File</span>
                    </motion.button>
                }
            />

            {/* Dashboard Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-8 pb-6 mt-8"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                                <FiFileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Dashboard Summary</h2>
                                <p className="text-gray-600 text-sm">Quick overview of your data and analytics</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-[#F9F4FF] to-white p-4 lg:p-6 rounded-2xl border border-[#7400B8]/10 shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-700 text-sm lg:text-base">Total Files</h3>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#7400B8]/10 rounded-xl flex items-center justify-center">
                                        <FiFileText className="w-4 h-4 lg:w-5 lg:h-5 text-[#7400B8]" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-[#7400B8]">{files?.length || 0}</p>
                                <p className="text-xs lg:text-sm text-gray-500 mt-2">
                                    {files?.length === 1 ? '1 file uploaded' : `${files?.length || 0} files uploaded`}
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-[#F9F4FF] to-white p-4 lg:p-6 rounded-2xl border border-[#7400B8]/10 shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-700 text-sm lg:text-base">Analyzed Files</h3>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#7400B8]/10 rounded-xl flex items-center justify-center">
                                        <FiBarChart2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#7400B8]" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-[#7400B8]">
                                    {files?.filter(file => file.analysis)?.length || 0}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-500 mt-2">
                                    {Math.round(((files?.filter(file => file.analysis)?.length || 0) / (files?.length || 1)) * 100)}% analyzed
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-[#F9F4FF] to-white p-4 lg:p-6 rounded-2xl border border-[#7400B8]/10 shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-700 text-sm lg:text-base">Total Storage</h3>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#7400B8]/10 rounded-xl flex items-center justify-center">
                                        <FiDatabase className="w-4 h-4 lg:w-5 lg:h-5 text-[#7400B8]" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-[#7400B8]">
                                    {formatFileSize(files?.reduce((acc, file) => acc + (file.sizeInBytes || 0), 0) || 0)}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-500 mt-2">
                                    Used storage space
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-[#F9F4FF] to-white p-4 lg:p-6 rounded-2xl border border-[#7400B8]/10 shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-700 text-sm lg:text-base">Processing</h3>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#7400B8]/10 rounded-xl flex items-center justify-center">
                                        <FiActivity className="w-4 h-4 lg:w-5 lg:h-5 text-[#7400B8]" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-[#7400B8]">0</p>
                                <p className="text-xs lg:text-sm text-gray-500 mt-2">
                                    No active analysis
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 px-8 pb-8 overflow-hidden">
                <div className="max-w-7xl mx-auto h-full">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center py-16"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center">
                                    <FiLoader className="w-8 h-8 text-white animate-spin" />
                                </div>
                                <p className="text-gray-600 font-medium">Loading your data sources...</p>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center py-16"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiBarChart2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Files</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full">
                            {files.length > 0 ? (
                                <div className="h-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
                                        {files.map((file, index) => (
                                            <motion.div
                                                key={file._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -5, scale: 1.02 }}
                                                onClick={() => handleFileSelect(file)}
                                                className={`bg-gradient-to-br from-[#F9F4FF] to-white p-4 lg:p-6 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between h-48 lg:h-52 ${
                                                    selectedFile?._id === file._id
                                                        ? 'border-[#7400B8]/50 shadow-lg'
                                                        : 'border-[#7400B8]/10 hover:border-[#7400B8]/30 hover:shadow-md'
                                                }`}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                                                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] flex items-center justify-center">
                                                            <FiFile className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs lg:text-sm font-semibold text-gray-800 truncate">
                                                                {file.originalName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2 lg:space-y-3">
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <FiDatabase className="w-3 h-3 mr-2" />
                                                            <span className="truncate">{file.fileCategory}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <FiDownload className="w-3 h-3 mr-2" />
                                                            <span>{formatFileSize(file.sizeInBytes)}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <FiCalendar className="w-3 h-3 mr-2" />
                                                            <span>{formatDate(file.uploadedAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-3 lg:mt-4">
                                                    {file.analysis ? (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/user/dashboard?fileId=${file._id}`);
                                                            }}
                                                            className="w-full px-2 lg:px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2 text-xs lg:text-sm font-medium shadow-lg"
                                                        >
                                                            <FiBarChart2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                                            <span>View Analysis</span>
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/user/dashboard?fileId=${file._id}`);
                                                            }}
                                                            className="w-full px-2 lg:px-3 py-2 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-xs lg:text-sm font-medium"
                                                        >
                                                            <FiCpu className="w-3 h-3 lg:w-4 lg:h-4" />
                                                            <span>Analyze</span>
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 flex items-center justify-center">
                                        <FiFile className="w-12 h-12 text-[#7400B8]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Sources Found</h3>
                                    <p className="text-gray-600 mb-6">Upload your first data file to get started with analytics</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/user/data-upload')}
                                        className="px-8 py-4 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        <span>Upload Your First File</span>
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    )}
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

export default DataSources; 