import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Search, UserPlus, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialIndex() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.trim()) {
            const delayDebounceFn = setTimeout(() => {
                searchUsers();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setUsers([]);
        }
    }, [searchQuery]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/friends/search?query=${searchQuery}`);
            setUsers(data);
        } catch (error) {
            console.error("Failed to search users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
        >
            <div className="glass-panel p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 p-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>

                <div className="relative z-10 text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Connect with People</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Find friends, partners, and collaborators across the platform.</p>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto mb-12">
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all backdrop-blur-sm shadow-xl shadow-violet-500/5"
                        />
                        {loading && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <div className="animate-spin h-5 w-5 border-2 border-violet-500 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <AnimatePresence mode='popLayout'>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group glass-panel p-4 rounded-2xl border border-white/10 dark:border-white/5 hover:border-violet-200 dark:hover:border-violet-500/30 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all hover:shadow-lg hover:shadow-violet-500/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <Link to={`/users/${user.id}`} className="flex items-center gap-4 group/profile">
                                            <div className="relative">
                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-0.5 shadow-lg shadow-violet-500/20 group-hover/profile:scale-105 transition-transform duration-300">
                                                    <div className="h-full w-full rounded-[14px] overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center">
                                                        {user.profile_picture ? (
                                                            <img src={user.profile_picture} alt={user.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold bg-gradient-to-br from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                                                                {user.name.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Online Status Indicator (Mock) */}
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover/profile:text-violet-600 dark:group-hover/profile:text-violet-400 transition-colors">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'super_admin' ? 'bg-rose-500' :
                                                        user.role === 'partner_admin' ? 'bg-amber-500' : 'bg-slate-400'
                                                        }`}></span>
                                                    {user.role?.replace('_', ' ') || 'User'}
                                                </p>
                                            </div>
                                        </Link>

                                        {currentUser.id !== user.id && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleMessage(user.id)}
                                                    className="p-3 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40 transition-all hover:scale-105 active:scale-95"
                                                    title="Send Message"
                                                >
                                                    <MessageCircle className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                                                    title="View Profile"
                                                    onClick={() => navigate(`/users/${user.id}`)}
                                                >
                                                    <UserPlus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : searchQuery && !loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-12 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No users found</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Try searching for a different name or role.</p>
                            </motion.div>
                        ) : !searchQuery ? (
                            <div className="col-span-full py-20 text-center opacity-50">
                                <UserPlus className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-lg font-medium text-slate-400 dark:text-slate-500">Start typing to find people...</p>
                            </div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
