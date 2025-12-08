import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundAnimation({ intensity = 'low' }) {
    const isHighIntensity = intensity === 'high';

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-900/50">
            {/* Primary Mesh Gradients - Base Layer - Centered Infinite Rotation (No Corners) */}
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.1)_120deg,transparent_180deg,rgba(168,85,247,0.1)_240deg,transparent_360deg)] mix-blend-normal pointer-events-none opacity-60 dark:opacity-40"
            />

            <motion.div
                animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-[100px] mix-blend-normal opacity-60 dark:opacity-40"
            />

            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1.1, 1, 1.1],
                }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] rounded-full bg-gradient-to-bl from-sky-500/20 via-pink-500/10 to-transparent blur-[100px] mix-blend-normal opacity-60 dark:opacity-40"
            />

            {/* Accent Orbs for Depth */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px] opacity-40 dark:opacity-30"
            />

            {/* High Intensity Extras: Geometric Shapes & More Color (Restored) */}
            {isHighIntensity && (
                <>
                    {/* Floating Geometric: Hollow Circle */}
                    <motion.div
                        className="absolute top-[15%] right-[15%] w-32 h-32 border-[6px] border-cyan-500/40 dark:border-cyan-400/50 rounded-full blur-[1px]"
                        animate={{
                            rotate: 360,
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Floating Geometric: Dotted Grid */}
                    <motion.div
                        className="absolute bottom-[20%] left-[10%] w-48 h-48 opacity-40 dark:opacity-50"
                        style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
                            backgroundSize: '12px 12px',
                            color: '#6366f1' // indigo-500
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.15, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Extra Vibrant Blobs */}
                    <motion.div
                        animate={{
                            x: [0, 60, 0],
                            y: [0, 60, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[35%] right-[25%] w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen dark:opacity-50"
                    />
                    <motion.div
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 40, 0],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-orange-400/30 rounded-full blur-[90px] opacity-50 mix-blend-multiply dark:mix-blend-screen dark:opacity-40"
                    />
                </>
            )}

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}

