import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import api from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import { FileText, MessageSquare, Newspaper, Activity, ArrowRight, AlertTriangle, Users, User, ArrowUpRight, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user } = useAuth();
    const { currentPartner } = usePartner();
    const { slug } = useParams();
    const [stats, setStats] = useState({
        total_users: 0,
        total_reports: 0,
        total_topics: 0,
        total_partners: 0,
        pending_partners: 0,
        total_news: 0
    });
    const [news, setNews] = useState([]);
    const [topics, setTopics] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Rating State
    const [userRating, setUserRating] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const params = slug ? { partner_slug: slug } : {};

                const { data } = await api.get('/dashboard', { params });
                setStats(data.stats);
                setNews(data.news);
                setTopics(data.forumTopics);
                setReports(data.reports);
                if (data.user_rating) setUserRating(data.user_rating);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [slug, user]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]" >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div >
    );

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-7xl mx-auto"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span>!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
                        Here's what's happening in your community today. You have full access to manage reports, participate in forums, and stay updated with the latest news.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-6">
                {user?.role === 'super_admin' ? (
                    <>
                        <Link to="/admin/verify-partners" className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900/70 dark:text-slate-400">Total Partners</p>
                                        <h3 className="text-2xl font-bold text-blue-950 dark:text-white">{stats.total_partners || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to="/admin/verify-partners" className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-xl">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-orange-900/70 dark:text-slate-400">Pending Requests</p>
                                        <h3 className="text-2xl font-bold text-orange-950 dark:text-white">{stats.pending_partners || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to="/users" className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-emerald-900/70 dark:text-slate-400">Total Users</p>
                                        <h3 className="text-2xl font-bold text-emerald-950 dark:text-white">{stats.total_users || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </>
                ) : user?.role === 'partner_admin' ? (
                    <>
                        <Link to={`/partners/${user.partner_slug || slug}/users`} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900/70 dark:text-slate-400">My Users</p>
                                        <h3 className="text-2xl font-bold text-blue-950 dark:text-white">{stats.total_users || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to={`/partners/${user.partner_slug || slug}/forum`} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 rounded-xl">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-violet-900/70 dark:text-slate-400">My Topics</p>
                                        <h3 className="text-2xl font-bold text-violet-950 dark:text-white">{stats.total_topics || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to={`/partners/${user.partner_slug || slug}/reports`} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-emerald-900/70 dark:text-slate-400">My Reports</p>
                                        <h3 className="text-2xl font-bold text-emerald-950 dark:text-white">{stats.total_reports || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to={slug ? `/partners/${slug}/reports` : '/reports'} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900/70 dark:text-slate-400">Total Reports</p>
                                        <h3 className="text-2xl font-bold text-blue-950 dark:text-white">{stats.total_reports || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to={slug ? `/partners/${slug}/forum` : '/forum'} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 rounded-xl">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-violet-900/70 dark:text-slate-400">Forum Topics</p>
                                        <h3 className="text-2xl font-bold text-violet-950 dark:text-white">{stats.total_topics || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        <Link to={slug ? `/partners/${slug}/news` : '/news'} className="min-w-[300px] flex-1 group">
                            <Card shine className="h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30 group-hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl">
                                        <Newspaper className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-emerald-900/70 dark:text-slate-400">News Articles</p>
                                        <h3 className="text-2xl font-bold text-emerald-950 dark:text-white">{stats.total_news || 0}</h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </>
                )}
            </div>

            {/* Partner Rating & Admin Section */}
            {slug && (
                ((user?.role === 'partner_admin' && currentPartner?.id === user?.partner_id) || user?.role === 'super_admin' || user?.role === 'general_user') && (
                    <div className="glass-panel p-6 rounded-2xl mb-8">
                        {(user?.role === 'partner_admin' && currentPartner?.id === user?.partner_id) || user?.role === 'super_admin' ? (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="flex h-3 w-3 rounded-full bg-indigo-500"></span>
                                        Admin View
                                    </h2>
                                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                                        Manage your partner page ratings.
                                    </p>
                                </div>
                                <Link
                                    to={`/partners/${slug}/ratings`}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    View Detailed Ratings & Comments
                                </Link>
                            </div>
                        ) : user?.role === 'general_user' ? (
                            <>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Rate this Partner</h3>
                                {userRating ? (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg key={star} className={`w-5 h-5 ${star <= userRating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="font-semibold text-indigo-900 dark:text-indigo-300">Your Rating</span>
                                        </div>
                                        {userRating.comment && (
                                            <p className="text-gray-700 dark:text-gray-300 italic">"{userRating.comment}"</p>
                                        )}
                                        <button
                                            onClick={() => {
                                                setRating(userRating.rating);
                                                setComment(userRating.comment || '');
                                                setUserRating(null);
                                            }}
                                            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Edit Rating
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleRateSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <svg className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Comment (Optional)</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows="3"
                                                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Share your experience..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={rating === 0 || submittingRating}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submittingRating ? 'Submitting...' : 'Submit Rating'}
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : null}
                    </div>
                )
            )}


            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* News Widget */}
                <Card className="h-full">
                    <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Newspaper className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <CardTitle className="text-slate-900 dark:text-white">Latest News</CardTitle>
                        </div>
                        <Link to="/news" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {news.length > 0 ? (
                            news.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.content}</p>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{item.author?.name || 'Admin'}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No news available at the moment.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Forum Widget */}
                <Card className="h-full">
                    <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            <CardTitle className="text-slate-900 dark:text-white">Recent Discussions</CardTitle>
                        </div>
                        <Link to="/forum" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">{topic.title}</h3>
                                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                            {topic.category || 'General'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{topic.content}</p>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                                                {topic.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span>{topic.user?.name || 'User'}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No discussions yet. Start one!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div >
    );
}
