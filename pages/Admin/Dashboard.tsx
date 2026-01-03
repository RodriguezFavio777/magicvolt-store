import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, LogOut, Package, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-secondary p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
                            <Shield className="text-primary size-10" />
                            Panel de Administración
                        </h1>
                        <p className="text-white/60">Bienvenido, {user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>

                {/* Hub Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Products Card */}
                    <Link
                        to="/admin/products"
                        className="group bg-surface hover:bg-white/5 border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 flex flex-col items-center text-center"
                    >
                        <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-secondary transition-colors duration-300">
                            <Package size={40} className="text-primary group-hover:text-secondary" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Gestión de Productos</h2>
                        <p className="text-white/50 mb-6">Agregar, editar o eliminar productos del catálogo. Control de stock e inventario.</p>
                        <div className="mt-auto flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                            Administrar Productos
                            <LayoutGrid size={18} />
                        </div>
                    </Link>

                    {/* Orders Card */}
                    <Link
                        to="/admin/orders"
                        className="group bg-surface hover:bg-white/5 border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 flex flex-col items-center text-center"
                    >
                        <div className="size-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                            <ShoppingBag size={40} className="text-green-500 group-hover:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Gestión de Pedidos</h2>
                        <p className="text-white/50 mb-6">Ver pedidos entrantes, confirmar pagos y gestionar envíos. Historial de ventas.</p>
                        <div className="mt-auto flex items-center gap-2 text-green-400 font-bold group-hover:gap-4 transition-all">
                            Ver Pedidos
                            <ShoppingBag size={18} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
