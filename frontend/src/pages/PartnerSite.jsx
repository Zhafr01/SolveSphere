import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/ui/PageLoader';

export default function PartnerSite() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [partner, setPartner] = useState(null);
    const [news, setNews] = useState([]);
    const [topics, setTopics] = useState([]);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Rating State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const { data } = await api.get(`/partners/${slug}`);
                setPartner(data.partner);
                setNews(data.news);
                setTopics(data.topics);
                setReports(data.reports);

                setStats(data.stats);
                setUserRating(data.user_rating);
            } catch (err) {
                console.error("Partner fetch error:", err);
                setError(err.response?.data?.message || 'Partner not found or inactive');
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [slug]);

    const handleRateSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setSubmittingRating(true);
        try {
            await api.post(`/partners/${slug}/rate`, {
                rating,
                comment
            });
            setUserRating({ rating, comment });
            alert('Rating submitted successfully!');
        } catch (err) {
            console.error("Rating error:", err);
            alert(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    if (loading) return <PageLoader message="Loading partner data..." />;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!partner) return <div className="text-center mt-10 text-red-600">Partner data unavailable</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10"
        >
            {/* Banner & Header */}
            <div className="relative mb-12">
                {/* Banner */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-56 md:h-72 w-full rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {partner.banner ? (
                        <img src={partner.banner} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </motion.div>

                {/* Header Info (Overlapping) */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-4 sm:mx-8 -mt-20 relative glass-panel p-8 rounded-3xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center sm:items-end gap-8 text-center sm:text-left"
                >
                    <div className="h-28 w-28 rounded-3xl bg-white/20 p-2 shadow-lg backdrop-blur-sm shrink-0 ring-1 ring-white/30">
                        <div className="h-full w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center">
                            {partner.logo ? (
                                <img src={partner.logo} alt={partner.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl font-black bg-gradient-to-br from-indigo-500 to-pink-600 bg-clip-text text-transparent">
                                    {partner.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow pb-2">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{partner.name}</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{partner.description}</p>
                        {partner.website && (
                            <a
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium group"
                            >
                                Visit Website
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.total_users || 0, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Total News', value: stats.total_news || 0, link: `/partners/${slug}/news`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Total Topics', value: stats.total_topics || 0, link: `/partners/${slug}/forum`, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    { label: 'Total Reports', value: stats.total_reports || 0, link: `/partners/${slug}/reports`, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                ].map((stat, i) => (
                    stat.link ? (
                        <Link
                            key={i}
                            to={stat.link}
                            className="glass-panel p-6 rounded-2xl hover:scale-105 transition-all duration-300 group border border-white/10"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <div className="w-6 h-6 rounded-full bg-current opacity-20"></div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <div className="w-6 h-6 rounded-full bg-current opacity-20"></div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Rating Section */}
            {(user?.role === 'partner_admin' && user?.partner_id === partner?.id) || user?.role === 'super_admin' ? (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="glass-panel p-8 rounded-3xl border-l-8 border-indigo-500 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="flex h-4 w-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
                                Admin Dashboard
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                                Manage and monitor your partner page performance.
                            </p>
                        </div>
                        <Link
                            to={`/partners/${slug}/ratings`}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            View Ratings & Reviews
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="glass-panel p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Rate this Partner</h2>
                    {userRating ? (
                        <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex bg-white dark:bg-slate-800 rounded-full px-3 py-1 shadow-sm">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className={`w-5 h-5 ${star <= userRating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    ))}
                                </div>
                                <span className="font-bold text-indigo-900 dark:text-indigo-300">Your Rating</span>
                            </div>
                            {userRating.comment && (
                                <p className="text-slate-700 dark:text-slate-300 italic pl-1 border-l-4 border-indigo-300 dark:border-indigo-700 ml-1">"{userRating.comment}"</p>
                            )}
                            <button
                                onClick={() => {
                                    setRating(userRating.rating);
                                    setComment(userRating.comment || '');
                                    setUserRating(null);
                                }}
                                className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                            >
                                Edit Review
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRateSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                                        >
                                            <svg className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Comment (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="3"
                                    className="w-full p-4 border-none rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none transition-all"
                                    placeholder="Share your experience..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={rating === 0 || submittingRating}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
                            >
                                {submittingRating ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </form>
                    )}
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* News Section */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                                </svg>
                            </span>
                            Latest News
                        </h2>
                        <Link to={`/partners/${slug}/news`} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {news.length > 0 ? (
                            news.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel p-6 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer border border-white/10"
                                >
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 text-sm">{item.content}</p>
                                    <div className="flex items-center text-xs text-slate-400 font-medium">
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-2 border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No updates posted yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Forum Section */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Forum Topics
                        </h2>
                        <Link to={`/partners/${slug}/forum`} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {topics.length > 0 ? (
                            topics.map((topic, i) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel p-6 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer border border-white/10"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">{topic.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${topic.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {topic.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 text-sm">{topic.content}</p>
                                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                                        <span>By {topic.user?.name || 'Unknown'}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-2 border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No topics started yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Reports Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="mt-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Reports</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.length > 0 ? (
                        reports.map((report, i) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{report.category}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        report.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                        {report.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{report.title}</h3>
                                <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${report.status === 'resolved' ? 'bg-green-500' : report.status === 'pending' ? 'bg-amber-500' : 'bg-slate-500'} w-full`}></div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 glass-panel rounded-2xl border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No reports filed.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
