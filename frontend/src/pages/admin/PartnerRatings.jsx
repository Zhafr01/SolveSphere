import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/ui/PageLoader';

export default function PartnerRatings() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [meta, setMeta] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchRatings(page);
    }, [slug, page]);

    const fetchRatings = async (pageNumber = 1) => {
        try {
            const { data } = await api.get(`/partners/${slug}/ratings?page=${pageNumber}`);
            // Check if backend returns new structure (ratings + stats) or old (just ratings)
            // Just in case checking for .ratings, otherwise fallback (though we constrained backend)
            if (data.ratings) {
                setRatings(data.ratings.data);
                setMeta(data.ratings);
                setStats(data.stats);
            } else {
                setRatings(data.data);
                setMeta(data);
            }
        } catch (error) {
            console.error("Failed to fetch ratings", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader message="Loading ratings..." />;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Partner Ratings</h1>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Average Rating Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                        <h2 className="text-5xl font-extrabold text-slate-800 dark:text-white mb-2">{stats.average || 0}</h2>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-6 h-6 ${star <= Math.round(stats.average) ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                            ))}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Based on {stats.total} reviews</p>
                    </div>

                    {/* Distribution Bars */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Rating Distribution</h3>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.distribution ? stats.distribution[star] : 0;
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 w-16 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <span>{star} stars</span>
                                        </div>
                                        <div className="flex-grow h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-yellow-400 rounded-full"
                                            />
                                        </div>
                                        <span className="w-12 text-right text-sm text-slate-500 dark:text-slate-400">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Reviews</h3>
                {ratings.length > 0 ? (
                    ratings.map((rating) => (
                        <motion.div
                            key={rating.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                                        {rating.user?.profile_picture ? (
                                            <img
                                                src={`http://localhost:8000/storage/${rating.user.profile_picture}`}
                                                alt={rating.user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900 dark:text-white">
                                            {rating.user?.name || 'Anonymous User'}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(rating.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                {rating.comment || <span className="italic text-slate-400">No comment provided.</span>}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Star className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">No ratings yet.</p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Pagination links={meta.links} onPageChange={setPage} />
            </div>
        </div>
    );
}
