import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { Check, X, Ban, Trash2, ExternalLink, Shield, ShieldAlert, Eye, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PartnersIndex() {
    const [searchParams] = useSearchParams();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'active');

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['active', 'pending'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { data } = await api.get('/super-admin/partners');
            setPartners(data.data);
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this partner?')) return;
        try {
            await api.post(`/super-admin/partners/${id}/approve`);
            fetchPartners(); // Refresh list
        } catch (error) {
            console.error("Failed to approve partner", error);
            alert('Failed to approve partner');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Are you sure you want to reject this partner application? This will delete the application.')) return;
        try {
            await api.post(`/super-admin/partners/${id}/reject`);
            fetchPartners(); // Refresh list
        } catch (error) {
            console.error("Failed to reject partner", error);
            alert('Failed to reject partner');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;
        try {
            await api.delete(`/super-admin/partners/${id}`);
            fetchPartners(); // Refresh list
        } catch (error) {
            console.error("Failed to delete partner", error);
            alert('Failed to delete partner');
        }
    };

    const handleSuspend = async (id) => {
        if (!confirm('Are you sure you want to suspend this partner? This will make their site inaccessible.')) return;
        try {
            await api.post(`/super-admin/partners/${id}/suspend`);
            fetchPartners(); // Refresh list
        } catch (error) {
            console.error("Failed to suspend partner", error);
            alert('Failed to suspend partner');
        }
    };

    const handleActivate = async (id) => {
        if (!confirm('Are you sure you want to activate (unsuspend) this partner?')) return;
        try {
            await api.post(`/super-admin/partners/${id}/activate`);
            fetchPartners(); // Refresh list
        } catch (error) {
            console.error("Failed to activate partner", error);
            alert('Failed to activate partner');
        }
    };

    const handleSubscriptionUpdate = async (partnerId, status) => {
        if (!confirm(`Are you sure you want to mark this subscription as ${status}?`)) return;
        try {
            await api.post(`/super-admin/partners/${partnerId}/subscription`, { status });
            fetchPartners();
        } catch (error) {
            console.error("Failed to update subscription", error);
            alert('Failed to update subscription');
        }
    };

    const filteredPartners = partners.filter(partner =>
        activeTab === 'active' ? (partner.status === 'active' || partner.status === 'approved' || partner.status === 'inactive') : partner.status === 'pending'
    );

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                        Manage Partners
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg font-medium">
                        Oversee partner applications and manage active partnerships.
                    </p>
                </div>
            </div>

            <div className="glass-panel p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl">
                {/* Modern Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl inline-flex w-full sm:w-auto backdrop-blur-md border border-white/20 dark:border-white/5">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'active'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-lg scale-105'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            Active Partners
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'pending'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-lg scale-105'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            Pending
                            {partners.filter(p => p.status === 'pending').length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-red-500/50 shadow-sm animate-pulse">
                                    {partners.filter(p => p.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Glass Table */}
                <div className="overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 shadow-inner bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 dark:divide-white/5">
                            <thead className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Partner</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Subscription</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/10 dark:divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredPartners.length > 0 ? (
                                        filteredPartners.map((partner, index) => (
                                            <motion.tr
                                                key={partner.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-white/40 dark:hover:bg-indigo-900/20 transition-all duration-300"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-14 w-14 relative group-hover:scale-110 transition-transform duration-300">
                                                            {partner.logo ? (
                                                                <img
                                                                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/50 dark:ring-white/10 shadow-lg"
                                                                    src={partner.logo.startsWith('http') ? partner.logo : `http://localhost:8000/storage/${partner.logo}`}
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/20">
                                                                    {partner.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                                                                {partner.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                                                {partner.domain}
                                                                {partner.website && (
                                                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600 p-0.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded">
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm ${partner.status === 'active' || partner.status === 'approved'
                                                        ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-emerald-500/10'
                                                        : partner.status === 'pending'
                                                            ? 'bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 dark:shadow-amber-500/10'
                                                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
                                                        }`}>
                                                        {partner.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {partner.latest_subscription ? (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${partner.latest_subscription.status === 'active'
                                                                    ? 'bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30'
                                                                    : 'bg-slate-100/50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                                    }`}>
                                                                    {partner.latest_subscription.status.toUpperCase()}
                                                                </span>
                                                                {partner.latest_subscription.proof_image && (
                                                                    <button
                                                                        onClick={() => setSelectedImage(`http://localhost:8000/storage/${partner.latest_subscription.proof_image}`)}
                                                                        className="p-1.5 rounded-full bg-white/50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 text-indigo-500 transition-colors shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                                                        title="View Proof"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {partner.latest_subscription.status === 'pending' && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <button
                                                                        onClick={() => handleSubscriptionUpdate(partner.id, 'active')}
                                                                        className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 transition-colors ring-1 ring-emerald-200 dark:ring-emerald-500/30"
                                                                        title="Approve Subscription"
                                                                    >
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSubscriptionUpdate(partner.id, 'rejected')}
                                                                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors ring-1 ring-red-200 dark:ring-red-500/30"
                                                                        title="Reject Subscription"
                                                                    >
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium italic opacity-70">No Subscription</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {partner.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
                                                                    title="Approve Partner"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
                                                                    title="Reject Application"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {(partner.status === 'active' || partner.status === 'approved') && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleSuspend(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-slate-100 text-amber-600 hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-amber-900/30 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                                                    title="Suspend Partner"
                                                                >
                                                                    <Ban className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-slate-100 text-red-600 hover:bg-red-50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/30 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                                                    title="Delete Partner"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {partner.status === 'inactive' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleActivate(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
                                                                    title="Reactivate Partner"
                                                                >
                                                                    <Shield className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(partner.id)}
                                                                    className="p-2.5 rounded-xl bg-slate-100 text-red-600 hover:bg-red-50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/30 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                                                    title="Delete Partner"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60">
                                                    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-full mb-4 shadow-inner">
                                                        <Search className="w-10 h-10" />
                                                    </div>
                                                    <p className="text-xl font-bold">No partners found</p>
                                                    <p className="text-sm mt-1">Try changing the tab or check back later.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 transform animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-200 backdrop-blur-md z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img src={selectedImage} alt="Payment Proof" className="max-w-full max-h-[85vh] object-contain" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
