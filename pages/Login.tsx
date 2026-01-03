import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
        }
    }, [location]);

    const getInputClass = (value: string) => {
        const baseClass = "w-full bg-secondary border rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-colors";

        if (!submitted && !value) return `${baseClass} border-white/10`;
        if (submitted && !value) return `${baseClass} border-red-500`;
        if (value) return `${baseClass} border-green-500`;

        return `${baseClass} border-white/10`;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!email || !password) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/', { replace: true });
        } catch (err: any) {
            console.error('Auth error:', err);
            setError('Credenciales inválidas. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Bienvenido</h1>
                    <p className="text-white/60">Inicia sesión para acceder al panel administrativo</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={getInputClass(email)}
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={getInputClass(password)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-secondary font-bold py-3 rounded-lg hover:bg-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
                    >
                        {loading ? 'Procesando...' : 'Iniciar Sesión'}
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
