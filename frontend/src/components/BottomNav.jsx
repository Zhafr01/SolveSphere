import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageSquare, User, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePartner } from '../context/PartnerContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const { user } = useAuth();
    const { currentPartner } = usePartner();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => {
        if (path === '/' || path === '/dashboard' || (currentPartner && path === `/partners/${currentPartner.slug}/dashboard`)) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        {
            label: 'News',
            icon: Radio,
            to: currentPartner ? `/partners/${currentPartner.slug}/news` : '/news'
        },
        {
            label: 'Forum',
            icon: MessageSquare,
            to: currentPartner ? `/partners/${currentPartner.slug}/forum` : '/forum'
        },
        {
            label: 'Home',
            icon: Home,
            to: currentPartner ? `/partners/${currentPartner.slug}/dashboard` : '/dashboard',
            isPrimary: true
        },
        {
            label: 'Reports',
            icon: FileText,
            to: currentPartner ? `/partners/${currentPartner.slug}/reports` : '/reports'
        },
        {
            label: 'Profile',
            icon: User,
            to: currentPartner ? `/partners/${currentPartner.slug}/profile` : '/profile'
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
                <div className="flex justify-around items-end h-16">
                    {navItems.map((item) => {
                        const active = isActive(item.to);
                        const Icon = item.icon;

                        if (item.isPrimary) {
                            return (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className="relative -top-5 group"
                                >
                                    <div className={clsx(
                                        "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
                                        active
                                            ? "bg-indigo-600 text-white shadow-indigo-500/30 scale-110"
                                            : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 active:scale-95"
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className={clsx(
                                        "absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium transition-colors whitespace-nowrap",
                                        active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                                    )}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-full h-full py-2 tap-highlight-transparent transition-colors",
                                    active
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <div className="relative">
                                    <Icon className={clsx("h-6 w-6 transition-transform duration-200", active && "scale-110")} />
                                    {active && (
                                        <motion.div
                                            layoutId="bottom-nav-indicator"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full"
                                        />
                                    )}
                                </div>
                                <span className="text-[10px] font-medium mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
