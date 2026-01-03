import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        if (path.startsWith('/error=') || path.includes('error=')) {
            const queryStr = path.startsWith('/') ? path.substring(1) : path;
            const params = new URLSearchParams(queryStr);

            const errorDescription = params.get('error_description')?.replace(/\+/g, ' ') || 'El enlace ha expirado o es inválido.';

            navigate('/login', { replace: true, state: { error: errorDescription } });
            return;
        }

        if (path.startsWith('/access_token=') || path.includes('access_token=')) {
            navigate('/admin', { replace: true });
            return;
        }

        navigate('/', { replace: true });
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2 border-primary/30"></div>
                <p className="text-white/60">Verificando...</p>
            </div>
        </div>
    );
};
