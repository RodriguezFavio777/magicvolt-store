import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LayoutGrid, Search, Filter } from 'lucide-react';
import { Product } from '../../types';
import { toast } from 'sonner';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name');

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleDeleteClick = (id: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Eliminar Producto',
            message: '¿Estás seguro? Esta acción no se puede deshacer.',
            isDestructive: true,
            onConfirm: async () => await executeDelete(id)
        });
    };

    const executeDelete = async (id: string) => {
        closeModal();
        const toastId = toast.loading('Eliminando producto...');

        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            toast.error('Error al eliminar el producto', { id: toastId });
        } else {
            toast.success('Producto eliminado', { id: toastId });
            fetchProducts();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-secondary text-primary">Cargando productos...</div>;

    return (
        <div className="min-h-screen bg-secondary p-6">
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDestructive={modalConfig.isDestructive}
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <LayoutGrid className="text-primary" />
                        Gestión de Productos
                    </h1>
                    <Link
                        to="/admin/products/new"
                        className="bg-primary text-secondary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors font-bold shadow-lg hover:scale-105 transform duration-200"
                    >
                        <Plus size={20} />
                        Nuevo Producto
                    </Link>
                </div>

                <div className="bg-surface rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-white/70">Imagen</th>
                                    <th className="p-4 text-white/70">Nombre</th>
                                    <th className="p-4 text-white/70">Categoría</th>
                                    <th className="p-4 text-white/70">Precio</th>
                                    <th className="p-4 text-white/70">Stock</th>
                                    <th className="p-4 text-white/70">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="size-12 rounded-lg bg-white/5 overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-white">{product.name}</td>
                                        <td className="p-4 text-white/60">{product.category}</td>
                                        <td className="p-4 text-primary font-mono">${product.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.stock && product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} `}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/products/${product.id}`}
                                                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(product.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-white/40">
                                            No hay productos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
