import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star } from 'lucide-react';
import api from '../lib/api';
import PartnerApplication from '../components/PartnerApplication';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const [partners, setPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const { data } = await api.get('/landing-page');
                setPartners(data.partners || []);
                setFilteredPartners(data.partners || []);
            } catch (error) {
                console.error("Failed to fetch partners", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = partners.filter(partner =>
                partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                partner.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPartners(filtered);
        } else {
            setFilteredPartners(partners);
        }
    }, [searchQuery, partners]);

    const handleApplyClick = () => {
        if (user) {
            setIsApplicationOpen(true);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-panel p-10 rounded-3xl inline-block"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-6 tracking-tight">
                            SolveSphere
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 font-light">
                            Solving problems? Simply lovely.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/login" className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                Login to Platform
                            </Link>
                            <button
                                onClick={handleApplyClick}
                                className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-700 shadow-md hover:bg-indigo-50 dark:hover:bg-slate-700 hover:shadow-lg transform hover:-translate-y-1 transition-all"
                            >
                                Become a Partner
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 relative overflow-hidden">


                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white mb-8 animate-gradient-x">
                            What is SolveSphere?
                        </h2>
                        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-2xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-light relative z-10">
                                SolveSphere is an all-in-one community engagement platform designed to bridge the gap between organizations and their members.
                                Whether you are a game developer, a university, or a service provider, SolveSphere allows you to create your own dedicated space
                                where users can report issues, discuss topics, read news, and chat directly with you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Community First",
                                    description: "Build a thriving community with dedicated forums and real-time chat.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    ),
                                    gradient: "from-blue-500 to-indigo-600",
                                    glow: "group-hover:shadow-indigo-500/40",
                                    border: "group-hover:border-indigo-500/50"
                                },
                                {
                                    title: "Feedback Loop",
                                    description: "Streamlined reporting system to track bugs and gather user feedback effectively.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    ),
                                    gradient: "from-purple-500 to-pink-600",
                                    glow: "group-hover:shadow-purple-500/40",
                                    border: "group-hover:border-purple-500/50"
                                },
                                {
                                    title: "Announcements",
                                    description: "Keep your users informed with a dedicated news and announcement feed.",
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    ),
                                    gradient: "from-orange-500 to-red-600",
                                    glow: "group-hover:shadow-orange-500/40",
                                    border: "group-hover:border-orange-500/50"
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className={`p-8 rounded-2xl bg-white/80 dark:bg-slate-800/40 backdrop-blur-md shadow-xl dark:shadow-2xl border border-white/20 dark:border-white/10 relative overflow-hidden group transition-all duration-300 ${feature.glow} ${feature.border}`}
                                >
                                    {/* Gradient Border Line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-80`}></div>

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>

                                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/5 transform group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light relative z-10">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Search & Showcase */}
            <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Our Trusted Partners</h2>
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for a partner..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-slate-600 dark:text-slate-400">Loading partners...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPartners.length > 0 ? (
                                filteredPartners.map((partner, index) => (
                                    <motion.div
                                        key={partner.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Link to={`/partners/${partner.slug}`} className="block h-full">
                                            <Card className="h-full p-0 hover:shadow-xl transition-all duration-300 border-none overflow-hidden group glass-card relative flex flex-col">
                                                {/* Banner */}
                                                <div className="h-48 w-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                                    {partner.banner ? (
                                                        <img
                                                            src={partner.banner}
                                                            alt={`${partner.name} banner`}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-transform duration-500 group-hover:scale-110"></div>
                                                    )}
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity"></div>
                                                </div>

                                                <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center flex-grow -mt-10 relative z-10">
                                                    {/* Logo */}
                                                    <div className="h-20 w-20 rounded-full bg-white dark:bg-slate-800 p-1 mb-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
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

                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{partner.name}</h3>

                                                    {/* Rating Display */}
                                                    <div className="flex items-center gap-1 mb-3">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {partner.ratings_avg_rating ? Number(partner.ratings_avg_rating).toFixed(1) : 'New'}
                                                        </span>
                                                        <span className="text-xs text-slate-500">({partner.ratings_count || 0})</span>
                                                    </div>

                                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{partner.description}</p>

                                                    <div className="mt-auto pt-4 w-full border-t border-slate-100 dark:border-slate-700/50">
                                                        <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                                                            Visit Community <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400">
                                    No partners found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Infinite Scroll Carousel (Visual Only - using duplicates for effect) */}
            {partners.length > 3 && (
                <section className="py-16 overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <div className="flex w-[200%] animate-scroll">
                        {[...partners, ...partners].map((partner, index) => (
                            <div key={`${partner.id}-${index}`} className="w-64 flex-shrink-0 px-4">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 overflow-hidden flex-shrink-0">
                                        {partner.logo && <img src={partner.logo} alt="" className="h-full w-full object-cover" />}
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{partner.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <PartnerApplication isOpen={isApplicationOpen} onClose={() => setIsApplicationOpen(false)} />
        </div>
    );
}
