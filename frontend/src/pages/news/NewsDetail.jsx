import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { usePartner } from '../../context/PartnerContext';
import { ArrowLeft, Loader2, Calendar, User, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import PageLoader from '../../components/ui/PageLoader';

export default function NewsDetail() {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentPartner } = usePartner();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const { data } = await api.get(`/news/${id}`);
                setNews(data);
            } catch (err) {
                console.error("Failed to fetch news details", err);
                setError("News article not found.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/news/${id}/like`);
            setNews(prev => ({ ...prev, likes_count: data.likes_count, is_liked_by_auth_user: data.liked }));
        } catch (error) {
            console.error("Failed to like news", error);
        }
    };

    if (loading) return <PageLoader message="Loading news article..." />;

    if (error) return (
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{error}</h2>
            <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
            >
                Go Back
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(currentPartner ? `/partners/${currentPartner.slug}/news` : '/news')}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to News</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
            >
                {news.image && (
                    <div className="w-full h-64 md:h-96 relative">
                        <img
                            src={news.image.startsWith('http') ? news.image : `http://localhost:8000/storage/${news.image}`}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-8 w-full">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 shadow-sm">{news.title}</h1>
                                <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{news.user?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(news.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!news.image && (
                    <div className="p-8 border-b border-gray-100 dark:border-slate-700">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{news.title}</h1>
                        <div className="flex items-center gap-6 text-gray-500 dark:text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{news.user?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(news.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8">
                    <div className="prose dark:prose-invert max-w-none mb-8 text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {news.content}
                    </div>

                    <div className="flex items-center pt-6 border-t border-gray-100 dark:border-slate-700">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${news.is_liked_by_auth_user
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                }`}
                        >
                            <ThumbsUp className={`h-5 w-5 ${news.is_liked_by_auth_user ? 'fill-current' : ''}`} />
                            <span className="font-medium">{news.likes_count || 0} Likes</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
