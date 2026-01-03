
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const ProductForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: 'Anillos',
        description: '',
        image: '',
        stock: 0,
        material: '',
        badge: '',
        new_collection: false
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setFormData(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Error fetching product details');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const getInputClass = (value: any, required = true) => {
        const baseClass = "w-full bg-secondary border rounded-lg p-3 text-white focus:border-primary outline-none";
        const valStr = String(value || '');

        // Neutral at start
        if (!submitted && !valStr) return `${baseClass} border-white/10`;

        // Error
        if (submitted && required && !valStr) return `${baseClass} border-red-500`;

        // Success
        if (valStr) return `${baseClass} border-green-500`;

        return `${baseClass} border-white/10`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        // Basic Check
        if (!formData.name || !formData.description || formData.price <= 0 || formData.stock < 0) {
            toast.error('Por favor completa los campos requeridos correctamente.');
            return;
        }

        setLoading(true);

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', id);
                if (error) throw error;
                navigate('/admin/products');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([formData]);
                if (error) throw error;

                toast.success('¡Producto agregado exitosamente!');
                navigate('/admin/products');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar producto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-primary hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <div className="max-w-2xl mx-auto bg-secondary-light rounded-2xl p-8 glass-panel border border-white/10">
                <div className="mb-8">
                    <h1 className="text-3xl font-display text-white mb-2">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    {successMessage && (
                        <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 font-bold animate-fade-in flex items-center gap-2">
                            <span>✅</span> {successMessage}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={getInputClass(formData.name)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={getInputClass(formData.category)}
                            >
                                <option value="Anillos">Anillos</option>
                                <option value="Collares">Collares</option>
                                <option value="Pulseras">Pulseras</option>
                                <option value="Aretes">Aretes</option>
                                <option value="Gafas">Gafas</option>
                                <option value="Conjuntos">Conjuntos</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={getInputClass(formData.price)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className={getInputClass(formData.stock)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Image</label>
                        <div className="space-y-4">
                            {formData.image && (
                                <div className="relative w-full h-48 bg-surface rounded-lg overflow-hidden border border-white/10">
                                    <img
                                        src={formData.image}
                                        alt="Product preview"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, image: '' }))}
                                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {!formData.image && (
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setUploading(true);
                                            try {
                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${Math.random()}.${fileExt}`;
                                                const filePath = `${fileName}`;

                                                const { error: uploadError } = await supabase.storage
                                                    .from('products')
                                                    .upload(filePath, file);

                                                if (uploadError) throw uploadError;

                                                const { data } = supabase.storage
                                                    .from('products')
                                                    .getPublicUrl(filePath);

                                                setFormData(p => ({ ...p, image: data.publicUrl }));
                                            } catch (error) {
                                                console.error('Error uploading image:', error);
                                                alert('Error uploading image');
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-white font-medium">
                                            {uploading ? 'Uploading...' : 'Click to upload image'}
                                        </span>
                                        <span className="text-white/40 text-sm">PNG, JPG up to 10MB</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full bg-secondary border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Material</label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                placeholder="e.g. Plata 925"
                                className="w-full bg-secondary border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Badge (Optional)</label>
                            <input
                                type="text"
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                placeholder="e.g. Nuevo"
                                className="w-full bg-secondary border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-white/10">
                        <input
                            type="checkbox"
                            id="new_collection"
                            checked={!!formData.new_collection}
                            onChange={(e) => setFormData(p => ({ ...p, new_collection: e.target.checked }))}
                            className="w-5 h-5 rounded border-white/20 text-primary bg-transparent focus:ring-primary/50 accent-primary cursor-pointer"
                        />
                        <label htmlFor="new_collection" className="text-white cursor-pointer select-none">
                            <span className="font-bold block">Marcado como Nueva Colección</span>
                            <span className="text-xs text-white/50">Aparecerá en la página dedicada de Colección</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-primary text-secondary font-medium hover:bg-white transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
