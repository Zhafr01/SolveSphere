import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, MoreVertical, Shield, ShieldOff, Ban, CheckCircle, ArrowUpCircle, User, Mail, Calendar, Briefcase } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersIndex() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, roleFilter]);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const endpoint = currentUser.role === 'super_admin' ? '/super-admin/users' : '/partner-admin/users';
            const { data } = await api.get(endpoint, {
                params: {
                    page,
                    search: searchTerm,
                    role: roleFilter !== 'all' ? roleFilter : undefined
                }
            });
            setUsers(data.data);
            setMeta(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            const prefix = currentUser.role === 'super_admin' ? '/super-admin' : '/partner-admin';
            await api.post(`${prefix}/users/${id}/${action}`);
            fetchUsers(currentPage);
        } catch (error) {
            console.error(`Failed to ${action} user`, error);
            alert(`Failed to ${action} user`);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage user roles, statuses, and permissions across the platform.
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            className="pl-10 pr-10 py-2.5 border-none rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700/50 focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white appearance-none shadow-sm cursor-pointer transition-all hover:bg-white/80 dark:hover:bg-slate-800/80"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="general_user">General User</option>
                            <option value="partner_admin">Partner Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="glass-panel overflow-hidden border border-white/20 dark:border-slate-700/30 shadow-xl relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="overflow-x-auto relative z-10">
                    <table className="min-w-full divide-y divide-white/10 dark:divide-white/5">
                        <thead className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 backdrop-blur-sm">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Partner</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-5 text-right text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/10 dark:divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                                                <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-white/40 dark:hover:bg-indigo-900/20 transition-all duration-300 cursor-pointer"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
                                                            <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                                                {user.profile_picture ? (
                                                                    <img src={user.profile_picture} alt={user.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <span className="text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                                                        {user.name.charAt(0)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize border shadow-sm ${user.role === 'super_admin'
                                                    ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20'
                                                    : user.role === 'partner_admin'
                                                        ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600'
                                                    }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {user.partner ? (
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                                                        {user.partner.name}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 opacity-60">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500"></span>
                                                        Global
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize border shadow-sm ${user.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                    : user.status === 'suspended'
                                                        ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                                        : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                    {user.status !== 'active' && (
                                                        <button
                                                            onClick={() => handleAction(user.id, 'activate')}
                                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                                            title="Activate"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    {user.status === 'active' && (
                                                        (currentUser?.role === 'super_admin' && user.role !== 'super_admin') ||
                                                        (currentUser?.role === 'partner_admin' && user.role === 'general_user')
                                                    ) && (
                                                            <button
                                                                onClick={() => handleAction(user.id, 'promote')}
                                                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-200 dark:border-indigo-500/30"
                                                                title="Promote"
                                                            >
                                                                <ArrowUpCircle className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                    {user.status !== 'suspended' && (
                                                        <button
                                                            onClick={() => handleAction(user.id, 'suspend')}
                                                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-colors border border-amber-200 dark:border-amber-500/30"
                                                            title="Suspend"
                                                        >
                                                            <ShieldOff className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    {user.status !== 'banned' && (
                                                        <button
                                                            onClick={() => handleAction(user.id, 'ban')}
                                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-colors border border-rose-200 dark:border-rose-500/30"
                                                            title="Ban"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <Search className="h-6 w-6 text-slate-400" />
                                                </div>
                                                <p className="text-base font-medium">No users found</p>
                                                <p className="text-sm">Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                    <Pagination
                        links={meta.links}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Modal - Premium Glass Style */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header Background */}
                            <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]"></div>
                                <div className="absolute top-0 right-0 p-4">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* User Avatar & Info */}
                            <div className="px-8 pb-8">
                                <div className="relative -mt-16 mb-6 flex flex-col items-center">
                                    <div className="h-32 w-32 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-xl">
                                        <div className="h-full w-full rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-indigo-100 dark:border-slate-700">
                                            {selectedUser.profile_picture ? (
                                                <img src={selectedUser.profile_picture} alt={selectedUser.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-bold text-indigo-500 dark:text-indigo-400">
                                                    {selectedUser.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h2>
                                        <div className="flex items-center justify-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                                            <Mail className="h-4 w-4" />
                                            <span>{selectedUser.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Shield className="h-3.5 w-3.5" /> Role
                                        </label>
                                        <div className="font-medium text-slate-700 dark:text-slate-200 capitalize">
                                            {selectedUser.role.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <CheckCircle className="h-3.5 w-3.5" /> Status
                                        </label>
                                        <div className={`font-medium capitalize ${selectedUser.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' :
                                            selectedUser.status === 'suspended' ? 'text-amber-600 dark:text-amber-400' :
                                                'text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {selectedUser.status}
                                        </div>
                                    </div>

                                    <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Briefcase className="h-3.5 w-3.5" /> Partner
                                        </label>
                                        <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                            {selectedUser.partner?.name || 'None'}
                                        </div>
                                    </div>

                                    <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" /> Joined
                                        </label>
                                        <div className="font-medium text-slate-700 dark:text-slate-200">
                                            {new Date(selectedUser.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                                    {selectedUser.status === 'active' && (
                                        (currentUser?.role === 'super_admin' && selectedUser.role !== 'super_admin') ||
                                        (currentUser?.role === 'partner_admin' && selectedUser.role === 'general_user')
                                    ) && (
                                            <button
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to promote this user?')) {
                                                        handleAction(selectedUser.id, 'promote');
                                                        setSelectedUser(null);
                                                    }
                                                }}
                                            >
                                                <ArrowUpCircle className="h-4 w-4" />
                                                Promote Role
                                            </button>
                                        )}
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

