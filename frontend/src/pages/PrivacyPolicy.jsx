import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, Scale } from 'lucide-react';

const Section = ({ icon: Icon, title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="mb-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </motion.div>
);

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20 pb-20">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/30 pointer-events-none" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
                    >
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Privacy & Data Protection
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-extrabold tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white">
                            Privacy Policy
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        At SolveSphere, we value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm font-mono text-slate-400 dark:text-slate-500"
                    >
                        Last updated: December 2025
                    </motion.p>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    <Section icon={Eye} title="Information We Collect" delay={0.1}>
                        <p>
                            We collect information you provide directly to us when using SolveSphere, such as when you create an account, update your profile, post in forums, or submit reports.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, password, and profile picture.</li>
                            <li><strong>User Content:</strong> Forum topics, comments, reports, news articles, and any other content you generate.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with the platform, including access times and pages viewed.</li>
                        </ul>
                    </Section>

                    <Section icon={Database} title="How We Use Your Data" delay={0.2}>
                        <p>
                            We use the collected data to provide, maintain, and improve our services. Specifically, we use it to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Authenticate your identity and secure your account.</li>
                            <li>Facilitate communication and interaction within the community forums and reporting systems.</li>
                            <li>Analyze platform usage to enhance user experience and performance.</li>
                            <li>Send administrative notifications regarding your account or policy updates.</li>
                        </ul>
                    </Section>

                    <Section icon={Lock} title="Data Security" delay={0.3}>
                        <p>
                            We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        <p>
                            We use industry-standard encryption protocols (SSL/TLS) for data transmission. However, please note that no method of transmission over the Internet is 100% secure.
                        </p>
                    </Section>

                    <Section icon={Globe} title="Cookies & Tracking" delay={0.4}>
                        <p>
                            SolveSphere uses cookies to enhance your browsing experience. Cookies help us remember your preferences and understand how you use our site. You can control cookie preferences through your browser settings.
                        </p>
                    </Section>

                    <Section icon={Scale} title="Your Rights" delay={0.5}>
                        <p>
                            You have the right to access, update, or delete your personal information stored on our platform. You can manage most of your data directly through your Profile settings.
                        </p>
                        <p>
                            If you have specific privacy concerns or request for data deletion, please contact our support team.
                        </p>
                    </Section>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center pt-8 border-t border-slate-200 dark:border-slate-800"
                >
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
