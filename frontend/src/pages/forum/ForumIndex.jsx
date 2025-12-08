import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/ui/PageLoader';

export default function ForumIndex() {
    const [topics, setTopics] = useState([]);
    const [meta, setMeta] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const { user } = useAuth();
    const { slug } = useParams();

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTopics(page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [slug, user, searchQuery, page]);

    const fetchTopics = async (pageNumber = 1) => {
        try {
            const params = {};
            if (slug) {
                params.partner_slug = slug;
            } else if (user?.partner_id) {
                params.partner_id = user.partner_id;
            }
            if (searchQuery) params.search = searchQuery;
            params.page = pageNumber;

            const { data } = await api.get('/forum-topics', { params });
            setTopics(data.data);
            setMeta(data);
        } catch (error) {
            console.error("Failed to fetch topics", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Red Flag! Stop this session (delete topic)?')) return;
        try {
            await api.delete(`/forum-topics/${id}`);
            fetchTopics();
        } catch (error) {
            console.error("Failed to delete topic", error);
            alert("Failed to delete topic");
        }
    };

    if (loading) return <PageLoader message="Loading forum topics..." />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto"
        >
            <div className="glass-panel p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Community Forum</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Join the discussion and share your thoughts.</p>
                    </div>
                    <Link
                        to={slug ? `/partners/${slug}/forum/create` : "/forum/create"}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                        Start New Topic
                    </Link>
                </div>

                {/* Search Bar - Full Width with Glass Effect */}
                <div className="w-full relative group mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin text-violet-500" /> : <Search className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />}
                    </div>
                    <input
                        type="text"
                        placeholder="Looking for grip..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={page}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-4"
                    >
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group glass-panel p-6 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all border border-white/10 dark:border-white/5 hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-grow space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide border border-slate-200 dark:border-slate-700">
                                                    {topic.category || 'General'}
                                                </span>
                                                <span className="text-sm text-slate-400 font-medium">•</span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    {new Date(topic.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>

                                            <Link
                                                to={slug ? `/partners/${slug}/forum/${topic.id}` : `/forum/${topic.id}`}
                                                className="block text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                                            >
                                                {topic.title}
                                            </Link>

                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                        {topic.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="font-medium">{topic.user?.name || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
                                            <div className="flex flex-col items-center justify-center px-4 py-2 bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-100 dark:border-violet-500/20">
                                                <span className="text-lg font-black text-violet-600 dark:text-violet-400">{topic.comments_count || 0}</span>
                                                <span className="text-xs font-bold text-violet-400 dark:text-violet-500 uppercase tracking-wider">Replies</span>
                                            </div>

                                            {(user?.id === topic.user_id || (user?.role === 'super_admin' && !slug) || (user?.role === 'partner_admin' && user?.partner_id === topic.partner_id)) && (
                                                <button
                                                    onClick={() => handleDelete(topic.id)}
                                                    className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    title="Delete Topic"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 glass-panel rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-700">
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">It's bwoken!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Be the first to start a conversation in the community!</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8">
                    <Pagination links={meta.links} onPageChange={setPage} />
                </div>
            </div>
        </motion.div>
    );
}
