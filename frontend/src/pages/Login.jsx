import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await login({ email, password });

            // Redirect to appropriate landing page
            if (data.user?.partner) {
                navigate(`/partners/${data.user.partner.slug}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            let errorMessage = err.response?.data?.message || 'Login failed';
            if (errorMessage.includes('SQLSTATE') || errorMessage.includes('Connection refused')) {
                errorMessage = 'System is currently unavailable. Please try again later.';
            }
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2" htmlFor="email">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field pr-10"
                        required
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Bono, my password is gone!
                </Link>
            </div>

            <div>
                <button
                    type="submit"
                    className="btn-primary w-full flex justify-center"
                >
                    Sign In
                </button>
            </div>

            <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Register
                    </Link>
                </p>
            </div>
        </form>
    );
}
