import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { usePartner } from '../../context/PartnerContext';
import { ArrowLeft, Upload } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';

export default function NewsCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { currentPartner } = usePartner() || {};
    const [partners, setPartners] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        partner_id: currentPartner?.id || user?.partner_id || ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentPartner) {
            api.get('/partners').then(res => {
                setPartners(res.data.data || []);
            }).catch(err => console.error(err));
        }
    }, [currentPartner]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        if (formData.partner_id) {
            data.append('partner_id', formData.partner_id);
        }
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await api.post('/news', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(currentPartner ? `/partners/${currentPartner.slug}/news` : '/news');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create news.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(currentPartner ? `/partners/${currentPartner.slug}/news` : '/news')} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create News</h1>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative z-60">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                {currentPartner ? (
                    <div className="relative z-50 mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Partner</label>
                        <div className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 cursor-not-allowed">
                            {currentPartner.name}
                        </div>
                        <input type="hidden" name="partner_id" value={currentPartner.id} />
                    </div>
                ) : (
                    <div className="relative z-50">
                        <CustomSelect
                            label="Partner (Optional)"
                            value={formData.partner_id}
                            onChange={(val) => setFormData({ ...formData, partner_id: val })}
                            options={[
                                { value: "", label: "-- Global News --" },
                                ...partners.map(p => ({ value: p.id, label: p.name }))
                            ]}
                            placeholder="Select Partner"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a partner if this news is specific to one.</p>
                    </div>
                )}

                <div className="relative z-40">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="6"
                        className="input-field"
                        required
                    ></textarea>
                </div>

                <div className="relative z-30">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Cover Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
                            <div className="flex text-sm text-gray-600 dark:text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-900 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500">PNG, JPG, GIF up to 2MB</p>
                            {formData.image && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-2">Selected: {formData.image.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end relative z-20">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Publishing...' : 'Publish News'}
                    </button>
                </div>
            </form>
        </div>
    );
}
