import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, ThumbsUp, Search, Loader2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/ui/PageLoader';

export default function NewsIndex() {
    const [news, setNews] = useState([]);
    const [meta, setMeta] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const { slug } = useParams();

    const fetchNews = useCallback(async (pageNumber = 1) => {
        try {
            const params = {};
            if (slug) {
                params.partner_slug = slug;
            }
            if (searchQuery) params.search = searchQuery;
            params.page = pageNumber;

            const { data } = await api.get('/news', { params });
            setNews(data.data);
            setMeta(data);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    }, [slug, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNews(page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchNews, page]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this news?")) return;
        try {
            await api.delete(`/news/${id}`);
            setNews(news.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete news", error);
        }
    };

    const handleLike = async (id) => {
        try {
            const { data } = await api.post(`/news/${id}/like`);
            setNews(news.map(n => n.id === id ? { ...n, likes_count: data.likes_count, is_liked_by_auth_user: data.liked } : n));
        } catch (error) {
            console.error("Failed to like news", error);
        }
    };



    if (loading) return <PageLoader message="Loading news..." />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto"
        >
            <div className="glass-panel p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Latest News</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with the latest announcements.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Search Bar - Expanded on desktop, full width on mobile */}
                        <div className="group relative flex-1 md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all backdrop-blur-sm shadow-sm"
                            />
                        </div>

                        {((user?.role === 'super_admin' && !slug) || (user?.role === 'partner_admin' && slug)) && (
                            <Link
                                to={slug ? `/partners/${slug}/news/create` : "/news/create"}
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 hover:scale-105"
                            >
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                                <span className="hidden sm:inline">Post News</span>
                                <span className="sm:hidden">Post</span>
                            </Link>
                        )}
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={page}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {news.length > 0 ? (
                            news.map((newsItem, index) => (
                                <motion.div
                                    key={newsItem.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group glass-panel rounded-2xl overflow-hidden hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all border border-white/10 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col h-full"
                                >
                                    {newsItem.image && (
                                        <div className="h-48 w-full overflow-hidden relative">
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={newsItem.image.startsWith('http') ? newsItem.image : `http://localhost:8000/storage/${newsItem.image}`}
                                                alt={newsItem.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                <Link to={slug ? `/partners/${slug}/news/${newsItem.id}` : `/news/${newsItem.id}`}>
                                                    {newsItem.title}
                                                </Link>
                                            </h2>
                                            {((user?.role === 'super_admin' && !slug) || user?.role === 'partner_admin') && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={slug ? `/partners/${slug}/news/${newsItem.id}/edit` : `/news/${newsItem.id}/edit`}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(newsItem.id);
                                                        }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{newsItem.content}</p>

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/10 mt-auto">
                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span className="bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">{new Date(newsItem.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    {newsItem.user?.name || 'Unknown'}
                                                </span>
                                            </div>

                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleLike(newsItem.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${newsItem.is_liked_by_auth_user ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'}`}
                                            >
                                                <motion.div
                                                    initial={false}
                                                    animate={newsItem.is_liked_by_auth_user ? { scale: [1, 1.4, 1], rotate: [0, -20, 20, 0] } : { scale: 1 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <ThumbsUp className={`h-4 w-4 ${newsItem.is_liked_by_auth_user ? 'fill-current' : ''}`} />
                                                </motion.div>
                                                {newsItem.likes_count || 0}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 glass-panel rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-700">
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Box, box. Box, box.</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Check back later for updates or try a different search.</p>
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
