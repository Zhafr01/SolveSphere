import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Bell, Globe, Database, Activity, FileText, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function Settings() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                    System Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage global configurations and monitor system health.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white mb-4 px-1">
                    <SettingsIcon className="h-5 w-5 text-indigo-500" />
                    <h2>General Configuration</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/super-admin/settings/site">
                        <Card className="h-full hover:border-indigo-500/30 dark:hover:border-indigo-400/30 group cursor-pointer" glow={true} gradient="from-blue-500/20 to-indigo-500/20">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Site Information</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Configure site name, description, and contact details.
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link to="/super-admin/settings/security">
                        <Card className="h-full hover:border-emerald-500/30 dark:hover:border-emerald-400/30 group cursor-pointer" glow={true} gradient="from-emerald-500/20 to-teal-500/20">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Security & Privacy</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Manage password policies, session timeouts, and firewalls.
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link to="/super-admin/settings/notifications">
                        <Card className="h-full hover:border-amber-500/30 dark:hover:border-amber-400/30 group cursor-pointer" glow={true} gradient="from-amber-500/20 to-orange-500/20">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Notifications</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Setup email templates, alerts, and notification triggers.
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link to="/super-admin/settings/maintenance">
                        <Card className="h-full hover:border-purple-500/30 dark:hover:border-purple-400/30 group cursor-pointer" glow={true} gradient="from-purple-500/20 to-pink-500/20">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <Database className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">System Maintenance</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    View logs, clear cache, and check database health.
                                </p>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white mb-4 px-1">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    <h2>System Status</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/super-admin/settings/system-info">
                        <Card className="bg-slate-900/5 dark:bg-slate-800/50 border-0 ring-1 ring-slate-200 dark:ring-slate-700/50 hover:ring-indigo-500/50 transition-all cursor-pointer h-full" glow={false}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">System Monitoring</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time metrics & performance</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link to="/super-admin/settings/system-docs">
                        <Card className="bg-slate-900/5 dark:bg-slate-800/50 border-0 ring-1 ring-slate-200 dark:ring-slate-700/50 hover:ring-teal-500/50 transition-all cursor-pointer h-full" glow={false}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Documentation</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Architecture & API blueprints</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}

