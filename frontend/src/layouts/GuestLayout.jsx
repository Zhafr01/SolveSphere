import { Outlet, Link } from 'react-router-dom';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function GuestLayout() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 relative overflow-hidden bg-transparent selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            {/* BackgroundAnimation handles the background now */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.03] dark:bg-grid-white/[0.02] bg-[size:32px_32px] z-0 pointer-events-none mask-gradient" />
            <BackgroundAnimation intensity="high" />
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative z-10">
                <Link to="/" className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
                    SolveSphere
                </Link>
            </div>

            <div className="relative z-10 w-full sm:max-w-md mt-8 px-8 py-8 glass-panel overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-50 -z-10 pointer-events-none" />
                <Outlet />
            </div>
        </div>
    );
}
