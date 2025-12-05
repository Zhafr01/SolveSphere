import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Pagination from '../../components/Pagination';

export default function PartnerRatings() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchRatings(page);
    }, [slug, page]);

    const fetchRatings = async (pageNumber = 1) => {
        try {
            const { data } = await api.get(`/partners/${slug}/ratings?page=${pageNumber}`);
            setRatings(data.data);
            setMeta(data);
        } catch (error) {
            console.error("Failed to fetch ratings", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Partner Ratings</h1>
            </div>

            <div className="space-y-4">
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
