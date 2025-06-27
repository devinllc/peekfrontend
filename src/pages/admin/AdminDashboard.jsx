import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/users?userId=${user.id}`);
            setUsers(res.data.Data || res.data.users || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setActionLoading(id);
        setError('');
        setSuccess('');
        try {
            await axios.delete(`${API_BASE_URL}/admin/users/${id}/?userId=${user.id}`);
            toast.success('User deleted successfully');
            setUsers(users.filter(u => u._id !== id && u.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        setActionLoading(id + '-role');
        setError('');
        setSuccess('');
        try {
            await axios.patch(`${API_BASE_URL}/admin/role/${id}/?userId=${user.id}`, { role: newRole });
            toast.success('Role updated successfully');
            setUsers(users.map(u => (u._id === id || u.id === id) ? { ...u, role: newRole } : u));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (id, updatedFields) => {
        setActionLoading(id + '-update');
        setError('');
        setSuccess('');
        try {
            await axios.patch(`${API_BASE_URL}/admin/users/${id}/?userId=${user.id}`, updatedFields);
            toast.success('User updated successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user');
        } finally {
            setActionLoading(null);
        }
    };

    // Modal open/close handlers
    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5 p-4">
            <div className="w-full max-w-7xl mx-auto bg-white/80 rounded-3xl shadow-xl border border-white/20 p-2 sm:p-6 mt-10">
                <h1 className="text-3xl font-bold mb-6 text-[#7400B8]">Admin Dashboard</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </div>
                    </div>
                ) : error ? null : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full w-full bg-white rounded-xl overflow-hidden shadow text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white">
                                    <th className="py-2 px-3 text-left font-semibold">Name</th>
                                    <th className="py-2 px-3 text-left font-semibold">Email</th>
                                    <th className="py-2 px-3 text-left font-semibold">Role</th>
                                    <th className="py-2 px-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id || u.id} className="border-b last:border-b-0 hover:bg-[#F9F4FF] transition-all">
                                        <td className="py-2 px-3 font-medium text-gray-800 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="text-[#7400B8]" /> {u.name || u.email}
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 text-gray-700 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FiMail className="text-[#9B4DCA]" /> {u.email}
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 whitespace-nowrap">
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 ${u.role === 'admin' ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white border-transparent' : 'bg-white text-[#7400B8] border-[#7400B8]'}`}
                                                    disabled={actionLoading === (u._id || u.id) + '-role'}
                                                    onClick={() => handleRoleChange(u._id || u.id, 'admin')}
                                                >
                                                    Admin
                                                </button>
                                                <button
                                                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 ${u.role === 'user' ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white border-transparent' : 'bg-white text-[#7400B8] border-[#7400B8]'}`}
                                                    disabled={actionLoading === (u._id || u.id) + '-role'}
                                                    onClick={() => handleRoleChange(u._id || u.id, 'user')}
                                                >
                                                    User
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 flex gap-2 flex-wrap whitespace-nowrap">
                                            <button
                                                className="bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white px-3 py-1 rounded-xl hover:shadow-lg transition-all duration-200 text-xs font-medium shadow"
                                                onClick={() => openModal(u)}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition-all duration-200 text-xs font-medium shadow disabled:opacity-50"
                                                disabled={actionLoading === (u._id || u.id)}
                                                onClick={() => handleDelete(u._id || u.id)}
                                            >
                                                {actionLoading === (u._id || u.id) ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {success && null}
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {showModal && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-0 sm:p-0 max-w-2xl w-full relative border border-[#7400B8]/10 mx-2 flex flex-col items-center overflow-hidden"
                        >
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-[#7400B8] transition-all z-20"
                                onClick={closeModal}
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                            <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 pt-10 pb-6 px-6 relative">
                                <div className="relative mb-4">
                                    <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#7400B8] to-[#9B4DCA] opacity-30 blur-lg"></div>
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white relative z-10">
                                        <FiUser className="w-16 h-16" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight drop-shadow">{selectedUser.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600 justify-center w-full mb-2">
                                    <FiMail className="w-5 h-5 text-[#9B4DCA]" />
                                    <span className="font-medium text-lg">{selectedUser.email}</span>
                                </div>
                            </div>
                            <div className="w-full px-6 pb-6">
                                <div className="bg-white/80 rounded-2xl shadow border border-[#7400B8]/10 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FiShield className="w-4 h-4 text-[#7400B8]" />
                                        <span className="font-medium">Role:</span>
                                        <span className={`px-2 py-1 rounded-xl text-xs font-semibold border ${selectedUser.role === 'admin' ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white border-transparent' : 'bg-white text-[#7400B8] border-[#7400B8]'}`}>{selectedUser.role}</span>
                                    </div>
                                    {selectedUser.userType && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">User Type:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.userType}</span>
                                        </div>
                                    )}
                                    {selectedUser.businessType && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Business Type:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.businessType}</span>
                                        </div>
                                    )}
                                    {selectedUser.phone && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Phone:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.phone}</span>
                                        </div>
                                    )}
                                    {selectedUser.company && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Company:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.company}</span>
                                        </div>
                                    )}
                                    {selectedUser.companyName && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Company Name:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.companyName}</span>
                                        </div>
                                    )}
                                    {selectedUser._id && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">User ID:</span>
                                            <span className="break-all bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser._id}</span>
                                        </div>
                                    )}
                                    {selectedUser.createdAt && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Created:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {selectedUser.updatedAt && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Updated:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{new Date(selectedUser.updatedAt).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {selectedUser.status && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Status:</span>
                                            <span className="bg-[#F9F4FF] px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.status}</span>
                                        </div>
                                    )}
                                </div>
                                {selectedUser.plan && (
                                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#F9F4FF] to-white border border-[#9B4DCA]/20 w-full max-w-lg shadow">
                                        <h3 className="text-lg font-bold text-[#7400B8] mb-3">Plan Details</h3>
                                        <div className="flex flex-col gap-2 mb-2">
                                            {selectedUser.plan.name && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-medium">Plan Name:</span>
                                                    <span className="bg-white/80 px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.plan.name}</span>
                                                </div>
                                            )}
                                            {selectedUser.plan.status && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-medium">Status:</span>
                                                    <span className="bg-white/80 px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.plan.status}</span>
                                                </div>
                                            )}
                                            {selectedUser.plan.price !== undefined && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-medium">Price:</span>
                                                    <span className="bg-white/80 px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{selectedUser.plan.price}</span>
                                                </div>
                                            )}
                                            {selectedUser.plan.expiry && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-medium">Expiry:</span>
                                                    <span className="bg-white/80 px-2 py-1 rounded-xl text-xs font-semibold border border-[#9B4DCA]/20">{new Date(selectedUser.plan.expiry).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        {selectedUser.plan.limits && (
                                            <div className="mt-2">
                                                <h4 className="font-semibold text-[#9B4DCA] mb-1">Limits</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(selectedUser.plan.limits).map(([key, value]) => (
                                                        <span key={key} className="bg-[#E0C3FC]/60 text-[#7400B8] px-3 py-1 rounded-full text-xs font-semibold border border-[#9B4DCA]/10">{key}: {value}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedUser.plan.features && (
                                            <div className="mt-2">
                                                <h4 className="font-semibold text-[#9B4DCA] mb-1">Features</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(selectedUser.plan.features).map(([key, value]) => (
                                                        <span key={key} className={`px-3 py-1 rounded-full text-xs font-semibold border ${value ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{key}: {String(value)}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard; 