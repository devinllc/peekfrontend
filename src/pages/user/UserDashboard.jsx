import { useState, useEffect, useRef } from 'react';
import { useLocation, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiBarChart2, FiCpu, FiActivity } from 'react-icons/fi';
import axios from 'axios';

// Import components
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import Analysis from '../../components/dashboard/Analysis';
import ApiLogs from '../../components/dashboard/ApiLogs';
import DataUpload from '../../components/dashboard/DataUpload';
import Profile from '../../components/dashboard/Profile';
import DataSources from '../../components/dashboard/DataSources';

const UserDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, getAllUserFiles } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [userFiles, setUserFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [fileError, setFileError] = useState('');
    const [analysisError, setAnalysisError] = useState('');
    const [apiLogs, setApiLogs] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const logIdRef = useRef(0);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (location.state) {
            if (location.state.selectedIndustry) {
                setSelectedIndustry(location.state.selectedIndustry);
            }
            if (location.state.uploadedFiles) {
                setUploadedFiles(location.state.uploadedFiles);
            }
        }
    }, [location]);

    // Check for fileId in URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fileId = params.get('fileId');
        if (fileId) {
            const file = userFiles.find(f => f._id === fileId);
            if (file) {
                setSelectedFile(file);
                if (file.analysis) {
                    setAnalysis(file.analysis);
                    setShowAnalysis(true);
                    // Add log entry for viewing analysis
                    setApiLogs(prevLogs => [
                        ...prevLogs,
                        {
                            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            timestamp: new Date().toISOString(),
                            message: `Viewing analysis for file: ${file.originalName}`,
                            type: 'info'
                        }
                    ]);
                }
            }
        }
    }, [location.search, userFiles]);

    // Fetch user files
    useEffect(() => {
        const fetchFiles = async () => {
            if (!user?._id) return;
            
            setIsLoadingFiles(true);
            setFileError('');
            try {
                const result = await getAllUserFiles(user._id);
                if (result.success && result.data?.files) {
                    const files = result.data.files.map(file => ({
                        ...file,
                        displayName: file.originalName || 'Unnamed File',
                        fileSize: file.sizeInBytes ? `${(file.sizeInBytes / (1024 * 1024)).toFixed(2)} MB` : 'Unknown Size',
                        category: file.fileCategory || 'General',
                        uploadDate: new Date(file.uploadedAt).toLocaleDateString()
                    }));
                    setUserFiles(files);
                    if (files.length > 0) {
                        setSelectedFile(files[0]);
                    }
                } else {
                    setFileError(result.error || "Error fetching files");
                }
            } catch (err) {
                setFileError(err.message || "Error fetching files");
            } finally {
                setIsLoadingFiles(false);
            }
        };

            fetchFiles();
    }, [user?._id, getAllUserFiles]);

    const handleLoadFileAnalysis = async (fileId) => {
        try {
            setSelectedFile(userFiles.find(f => f._id === fileId));
            setIsLoadingAnalysis(true);
            setAnalysis(null);
            setAnalysisError(null);
            setShowAnalysis(false);

            // Add initial log entry
            const logId = Date.now().toString();
            setApiLogs(prev => [...prev, {
                id: logId,
                timestamp: new Date().toISOString(),
                message: `Starting analysis for file: ${userFiles.find(f => f._id === fileId)?.originalName}`,
                type: 'info'
            }]);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`https://api.peekbi.com/files/analyse/${user._id}/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Add success log entry
            setApiLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                message: 'Analysis completed successfully',
                type: 'success'
            }]);

            setAnalysis(response.data.analysis);
            setShowAnalysis(true);
        } catch (err) {
            console.error('Error loading analysis:', err);
            setAnalysisError(err.response?.data?.message || 'Failed to load analysis');
            
            // Add error log entry
            setApiLogs(prev => [...prev, {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                message: `Analysis failed: ${err.response?.data?.message || 'Unknown error'}`,
                type: 'error'
            }]);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const handleBackToDashboard = () => {
        setShowAnalysis(false);
                                    setSelectedFile(null);
                                    setAnalysis(null);
                                    navigate('/user/dashboard');
    };

    const DashboardContent = () => {
        if (showAnalysis && selectedFile && analysis) {
            return (
                <div className="space-y-8">
                    <Analysis 
                        selectedFile={selectedFile} 
                        analysis={analysis} 
                        onBack={handleBackToDashboard}
                    />
                </div>
            );
        }

        if (selectedFile && isLoadingAnalysis) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="space-y-8">
                            <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] opacity-20 animate-pulse"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] animate-spin"></div>
                                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                                    <FiCpu className="w-8 h-8 text-[#7400B8]" />
                                            </div>
                                        </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Data</h2>
                            <p className="text-gray-600 mb-6">Processing your file to extract valuable insights...</p>
                            
                            <div className="w-full max-w-md mx-auto">
                                <div className="relative">
                                    <div className="flex mb-3 items-center justify-between">
                                        <span className="text-sm font-medium text-[#7400B8]">Processing</span>
                                        <span className="text-sm text-gray-500">Analyzing...</span>
                                        </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full animate-progress"></div>
                                    </div>
                                </div>
                            </div>
                            </div>

                            {/* API Logs during analysis */}
                            <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiActivity className="w-5 h-5 text-[#7400B8]" />
                                Analysis Progress
                            </h3>
                            <div className="bg-gray-50/50 rounded-2xl p-6 max-h-60 overflow-y-auto space-y-3">
                                    {apiLogs.slice(-5).map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-start gap-3 p-3 rounded-xl ${
                                            log.type === 'error' ? 'bg-red-50/50 text-red-600' :
                                            log.type === 'success' ? 'bg-green-50/50 text-green-600' :
                                            'bg-blue-50/50 text-blue-600'
                                        }`}
                                    >
                                            <div className="flex-shrink-0 mt-1">
                                            {log.type === 'error' ? '❌' :
                                             log.type === 'success' ? '✅' :
                                             '⏳'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{log.message}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <>
                <DashboardOverview
                    userFiles={userFiles}
                            selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                            isLoadingAnalysis={isLoadingAnalysis}
                    analysis={analysis}
                            analysisError={analysisError}
                    handleLoadFileAnalysis={handleLoadFileAnalysis}
                    navigate={navigate}
                        />
                    </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5">
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                            <Routes>
                                <Route index element={
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <Header
                                    title="Dashboard"
                                    description="Welcome back! Here's your data overview"
                                    icon={FiBarChart2}
                                />

                                {/* Content */}
                                <div className="flex-1 p-8 overflow-y-auto">
                                    <div className="max-w-7xl mx-auto">
                                        <DashboardContent />
                                        {!showAnalysis && (
                                            <div className="mt-8">
                                            <ApiLogs logs={apiLogs} />
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                                } />
                                <Route path="dashboard" element={
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <Header
                                    title="Dashboard"
                                    description="Welcome back! Here's your data overview"
                                    icon={FiBarChart2}
                                />

                                {/* Content */}
                                <div className="flex-1 p-8 overflow-y-auto">
                                    <div className="max-w-7xl mx-auto">
                                        <DashboardContent />
                                        {!showAnalysis && (
                                            <div className="mt-8">
                                            <ApiLogs logs={apiLogs} />
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                                } />
                                <Route path="data-sources" element={<DataSources />} />
                                <Route path="data-upload" element={<DataUpload />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="*" element={<Navigate to="dashboard" replace />} />
                            </Routes>
                </main>
            </div>
        </div>
    );
};

// Add this to your existing styles
const styles = `
    @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
    }
    .animate-progress {
        animation: progress 2s ease-in-out infinite;
    }
`;

export default UserDashboard;