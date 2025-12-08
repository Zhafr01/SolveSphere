import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, UserX, MessageSquare, Gavel } from 'lucide-react';

const Section = ({ icon: Icon, title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="mb-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </motion.div>
);

export default function TermsOfService() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20 pb-20">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 pointer-events-none" />
            <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-4"
                    >
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Terms & Conditions
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-extrabold tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white">
                            Terms of Service
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Please read these terms carefully before using the SolveSphere platform. By using our services, you agree to be bound by these terms.
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
                    <Section icon={CheckCircle} title="Acceptance of Terms" delay={0.1}>
                        <p>
                            By accessing or using SolveSphere (the "Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, simply do not use the Platform.
                        </p>
                    </Section>

                    <Section icon={UserX} title="User Accounts" delay={0.2}>
                        <p>
                            To access certain features, you must create an account. You maintain full responsibility for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must provide accurate and complete information.</li>
                            <li>You are responsible for safeguarding your password.</li>
                            <li>You must notify us immediately of any breach of security.</li>
                        </ul>
                    </Section>

                    <Section icon={MessageSquare} title="Community Guidelines" delay={0.3}>
                        <p>
                            SolveSphere fosters a collaborative environment. When using Forums, Reports, or News features, you agree NOT to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Post content that is illegal, harmful, threatening, abusive, or defamatory.</li>
                            <li>Harass or discriminate against other users.</li>
                            <li>Spam or post irrelevant content.</li>
                            <li>Post sensitive personal information of others.</li>
                        </ul>
                        <p className="mt-2 text-sm italic">
                            We reserve the right to remove content that violates these guidelines.
                        </p>
                    </Section>

                    <Section icon={AlertTriangle} title="Disclaimer of Warranties" delay={0.4}>
                        <p>
                            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation of the Platform or the information, content, or materials included.
                        </p>
                    </Section>

                    <Section icon={Gavel} title="Termination" delay={0.5}>
                        <p>
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
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
                        SolveSphere &copy; 2025. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
