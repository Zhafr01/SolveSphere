import { Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'We are checking...' }) {
    return (
        <div className="flex items-center gap-3 md:pl-20 pl-2 pt-1">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">{message}</span>
        </div>
    );
}
