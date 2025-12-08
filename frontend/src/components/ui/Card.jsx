import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, shine = false, glow = true, gradient = "from-indigo-500 to-purple-500", ...props }) {
    return (
        <div className="relative group h-full">
            {glow && (
                <div className={twMerge(
                    "absolute inset-0 bg-gradient-to-br rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10",
                    gradient
                )} />
            )}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4 }}
                className={twMerge(
                    "glass-card p-6 h-full",
                    shine && "shine-effect",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        </div>
    );
}

export function CardHeader({ children, className }) {
    return (
        <div className={twMerge("mb-4", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }) {
    return (
        <h3 className={twMerge("text-xl font-bold text-slate-800 dark:text-white", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }) {
    return (
        <div className={twMerge("", className)}>
            {children}
        </div>
    );
}
