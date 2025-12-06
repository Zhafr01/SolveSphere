import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Banner & Header */}
            <div className="relative mb-8">
                {/* Banner */}
                <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {partner.banner ? (
                        <img src={partner.banner} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    )}
                </div>

                {/* Header Info (Overlapping) */}
                <div className="mx-4 sm:mx-8 -mt-16 relative bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                    <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-md shrink-0">
                        <div className="h-full w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {partner.logo ? (
                                <img src={partner.logo} alt={partner.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-500">
                                    {partner.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow pb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{partner.name}</h1>
                        <p className="mt-1 text-gray-500 dark:text-slate-400">{partner.description}</p>
                        {partner.website && (
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm font-medium">
                                Visit Website
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_users || 0}</h3>
                </div>
                <Link to={`/partners/${slug}/news`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-200 cursor-pointer block">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total News</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_news || 0}</h3>
                </Link>
                <Link to={`/partners/${slug}/forum`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-200 cursor-pointer block">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Topics</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_topics || 0}</h3>
                </Link>
                <Link to={`/partners/${slug}/reports`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-200 cursor-pointer block">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Reports</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_reports || 0}</h3>
                </Link>
            </div>

            {/* Rating Section */}
            {user?.role === 'partner_admin' && user?.partner_id === partner?.id ? (
                <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg mb-8 p-6 border-l-4 border-indigo-500">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="flex h-3 w-3 rounded-full bg-indigo-500"></span>
                                Admin View
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400 mt-1">
                                You are viewing your own partner page.
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
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg mb-8 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rate this Partner</h2>
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
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* News Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Latest News</h2>
                    <div className="space-y-4">
                        {news.length > 0 ? (
                            news.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-300 mb-2">{item.content.substring(0, 100)}...</p>
                                    <span className="text-sm text-gray-500 dark:text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-slate-400">No news available.</p>
                        )}
                    </div>
                </div>

                {/* Forum Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Forum Topics</h2>
                    <div className="space-y-4">
                        {topics.length > 0 ? (
                            topics.map((topic) => (
                                <div key={topic.id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{topic.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-300 mb-2">{topic.content.substring(0, 100)}...</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
                                        <span>By {topic.user?.name || 'Unknown'}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${topic.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {topic.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-slate-400">No topics yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reports Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Reports</h2>
                <div className="grid grid-cols-1 gap-4">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-300 text-sm">{report.category}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-slate-400">No reports found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
