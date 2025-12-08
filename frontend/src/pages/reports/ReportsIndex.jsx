import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../../components/ui/CustomSelect';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/ui/PageLoader';

export default function ReportsIndex() {
    const [reports, setReports] = useState([]);
    const [meta, setMeta] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const { slug } = useParams();

    const fetchReports = useCallback(async (pageNumber = 1) => {
        try {
            const params = {};
            if (slug) {
                params.partner_slug = slug;
            } else if (user?.partner_id) {
                params.partner_id = user.partner_id;
            }
            if (searchQuery) params.search = searchQuery;
            if (statusFilter) params.status = statusFilter;
            if (urgencyFilter) params.urgency = urgencyFilter;
            if (categoryFilter) params.category = categoryFilter;
            params.page = pageNumber;

            const { data } = await api.get('/reports', { params });
            console.log('Reports data:', data.data);
            setReports(data.data);
            setMeta(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    }, [slug, user, searchQuery, statusFilter, urgencyFilter, categoryFilter]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, statusFilter, urgencyFilter, categoryFilter]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchReports(page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchReports, page]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/reports/${id}`, { status: newStatus });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this report?")) return;
        try {
            await api.delete(`/reports/${id}`);
            setReports(reports.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete report", error);
        }
    };



    if (loading) return <PageLoader message="Loading reports..." />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto"
        >
            <div className="glass-panel p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex flex-col gap-8 mb-8 relative z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reports Management</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track issues across the platform.</p>
                        </div>
                        {(!['super_admin', 'partner_admin'].includes(user?.role) || (user?.role === 'super_admin' && slug)) && (
                            <Link
                                to={slug ? `/partners/${slug}/reports/create` : "/reports/create"}
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
                            >
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                                New Report
                            </Link>
                        )}
                    </div>

                    {/* Search Bar - Full Width with Glass Effect */}
                    <div className="w-full relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {loading ? <Loader2 className="h-5 w-5 animate-spin text-indigo-500" /> : <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
                        </div>
                        <input
                            type="text"
                            placeholder="Search reports by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all backdrop-blur-sm shadow-sm hover:shadow-md"
                        />
                    </div>

                    {/* Filters and Action Button Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CustomSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { value: "", label: "All Status" },
                                { value: "pending", label: "Pending" },
                                { value: "in_progress", label: "In Progress" },
                                { value: "resolved", label: "Resolved" },
                            ]}
                            placeholder="Filter by Status"
                            className="h-12"
                        />
                        <CustomSelect
                            value={urgencyFilter}
                            onChange={setUrgencyFilter}
                            options={[
                                { value: "", label: "All Urgency" },
                                { value: "Low", label: "Low" },
                                { value: "Medium", label: "Medium" },
                                { value: "High", label: "High" },
                                { value: "Critical", label: "Critical" },
                            ]}
                            placeholder="Filter by Urgency"
                            className="h-12"
                        />
                        <CustomSelect
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={[
                                { value: "", label: "All Categories" },
                                { value: "General", label: "General" },
                                { value: "Infrastructure", label: "Infrastructure" },
                                { value: "Academic", label: "Academic" },
                                { value: "Administrative", label: "Administrative" },
                            ]}
                            placeholder="Filter by Category"
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/20 dark:border-white/5 shadow-inner bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200/50 dark:divide-white/5">
                            <thead className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Partner</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgency</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {reports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                        reports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map((report, index) => (
                                            <motion.tr
                                                key={report.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`group transition-all duration-200 hover:bg-white/60 dark:hover:bg-slate-800/60`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{report.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                    {report.partner ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                            {report.partner.name}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                            Global
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {report.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border shadow-sm
                                                    ${report.urgency === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50' :
                                                            report.urgency === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50' :
                                                                report.urgency === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50' :
                                                                    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50'}`}>
                                                        {report.urgency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {((user?.role === 'super_admin' && !slug) || user?.role === 'partner_admin') ? (
                                                        <div className="relative">
                                                            <select
                                                                value={report.status}
                                                                onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                                                className={`appearance-none pl-3 pr-8 py-1 text-xs font-bold rounded-full border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all
                                                                ${report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                        report.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="resolved">Resolved</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                                                                <ChevronDown className="h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border shadow-sm
                                                        ${report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50' :
                                                                report.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50' :
                                                                    'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                                                            {report.status.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            to={slug ? `/partners/${slug}/reports/${report.id}` : `/reports/${report.id}`}
                                                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                                                            title="View Details"
                                                        >
                                                            <Search className="h-4 w-4" />
                                                        </Link>
                                                        {(user?.id === report.user_id || (user?.role === 'super_admin' && !slug) || (user?.role === 'partner_admin' && user?.partner_id === report.partner_id)) && (
                                                            <button
                                                                onClick={() => handleDelete(report.id)}
                                                                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 transition-colors border border-rose-200 dark:border-rose-500/30 shadow-sm"
                                                                title="Delete Report"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td colSpan="8" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                        <Search className="h-8 w-8 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No reports found</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                                        We couldn't find any reports matching your search or filters.
                                                    </p>
                                                    <button
                                                        onClick={() => { setSearchQuery(''); setStatusFilter(''); setUrgencyFilter(''); setCategoryFilter(''); }}
                                                        className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
                    <Pagination links={meta.links} onPageChange={setPage} />
                </div>
            </div>
        </motion.div>
    );
}
