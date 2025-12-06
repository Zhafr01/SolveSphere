import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Globe, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

import { usePartner } from '../../../context/PartnerContext';

export default function PartnerSiteSettings() {
    const { currentPartner } = usePartner();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        logo: null,
        banner: null
    });
    const [previews, setPreviews] = useState({
        logo: null,
        banner: null
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/partner-admin/settings');
                const partner = data.partner;
                setFormData({
                    name: partner.name || '',
                    description: partner.description || '',
                    website: partner.website || '',
                    logo: null,
                    banner: null // Files are reset, previews show current
                });
                setPreviews({
                    logo: partner.logo,
                    banner: partner.banner
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData(prev => ({ ...prev, [name]: file }));
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description || '');
            data.append('website', formData.website || '');
            if (formData.logo) data.append('logo', formData.logo);
            if (formData.banner) data.append('banner', formData.banner);
            // Needed for Laravel to handle multipart/form-data PUT/PATCH correctly if we wer using PUT, but we use POST here
            // data.append('_method', 'PUT'); 

            await api.post('/partner-admin/settings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            console.error("Failed to update settings", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (fetchLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    to={currentPartner ? `/partners/${currentPartner.slug}/dashboard` : "/dashboard"}
                    className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    title="Go Back"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Partner Site Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your public partner page.</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                    }`}>
                    <AlertCircle className="h-5 w-5" />
                    <p>{message.text}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Partner Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-400" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                placeholder="Describe your organization..."
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-6">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                                Logo (Avatar)
                            </label>
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0">
                                    {previews.logo ? (
                                        <img src={previews.logo} alt="Logo Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-400">No Logo</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="block w-full text-sm text-slate-500 dark:text-slate-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100
                                            dark:file:bg-slate-700 dark:file:text-indigo-400
                                        "
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Square image, max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                                Banner Image
                            </label>
                            <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 relative group">
                                {previews.banner ? (
                                    <img src={previews.banner} alt="Banner Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                        No Banner Uploaded
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="banner"
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-slate-500 dark:text-slate-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100
                                    dark:file:bg-slate-700 dark:file:text-indigo-400
                                "
                            />
                            <p className="mt-1 text-xs text-slate-500">Landscape image recommended, max 4MB.</p>
                        </div>

                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Save className="h-4 w-4" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
