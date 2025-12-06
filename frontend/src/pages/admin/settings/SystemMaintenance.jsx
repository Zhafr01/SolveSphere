import React, { useState } from 'react';
import { ArrowLeft, Database, RefreshCw, Download, CheckCircle, AlertCircle, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SystemMaintenance() {
    const [isClearingCache, setIsClearingCache] = useState(false);
    const [isDownloadingLogs, setIsDownloadingLogs] = useState(false);

    const handleClearCache = () => {
        if (window.confirm('Are you sure you want to clear the system cache? This might temporarily affect performance.')) {
            setIsClearingCache(true);
            setTimeout(() => {
                setIsClearingCache(false);
                alert('System cache cleared successfully!');
            }, 2000);
        }
    };

    const handleDownloadLogs = () => {
        setIsDownloadingLogs(true);
        setTimeout(() => {
            setIsDownloadingLogs(false);
            alert('Logs downloaded successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    to="/super-admin/settings"
                    className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    title="Go Back"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Maintenance</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor system health and perform maintenance tasks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">System Status</h3>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Operational
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Uptime: 99.9%</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">Database</h3>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Connected
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Size: 45.2 MB</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">Last Backup</h3>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        2 hours ago
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Next backup: 22:00</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Maintenance Actions</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                                <RefreshCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 dark:text-white">Clear System Cache</h3>
                                <p className="text-slate-500 dark:text-slate-400">Remove temporary files and cached data.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearCache}
                            disabled={isClearingCache}
                            className="px-6 py-2.5 font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isClearingCache ? 'Clearing...' : 'Clear Cache'}
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                                <Download className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 dark:text-white">Download System Logs</h3>
                                <p className="text-slate-500 dark:text-slate-400">Export system activity logs for analysis.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownloadLogs}
                            disabled={isDownloadingLogs}
                            className="px-6 py-2.5 font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isDownloadingLogs ? 'Downloading...' : 'Download Logs'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
