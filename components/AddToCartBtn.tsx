import React from 'react';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface AddToCartBtnProps {
    product: Product;
    variant?: 'catalog' | 'detail';
    className?: string; // Additional classes for positioning in layout
}

export const AddToCartBtn: React.FC<AddToCartBtnProps> = ({ product, variant = 'detail', className = '' }) => {
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const stock = product.stock ?? 100;

        if (quantity >= stock) return;

        if (quantity === 0) {
            addToCart(product);
        } else {
            updateQuantity(product.id, 1);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (quantity > 1) {
            updateQuantity(product.id, -1);
        } else {
            removeFromCart(product.id);
        }
    };

    // Variant: Catalog (Overlay)
    if (variant === 'catalog') {
        if (quantity === 0) {
            return (
                <button
                    onClick={handleIncrement}
                    disabled={product.stock === 0}
                    className={`bg-white text-secondary p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary hover:text-secondary hover:scale-110 active:scale-95 z-20 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={product.stock === 0 ? "Agotado" : "Añadir al carrito"}
                >
                    <ShoppingBag size={20} />
                </button>
            );
        }

        // Active state (Quantity Control)
        return (
            <div
                className={`flex items-center gap-2 bg-secondary text-white p-1.5 rounded-full shadow-xl border border-white/10 transition-all duration-300 z-20 ${className}`}
                onClick={(e) => e.stopPropagation()} // Prevent card click
            >
                <button
                    onClick={handleDecrement}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    {quantity === 1 ? <Trash2 size={16} className="text-red-400" /> : <Minus size={16} />}
                </button>
                <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= (product.stock || 100)}
                    className="p-1.5 rounded-full bg-primary text-secondary hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={16} />
                </button>
            </div>
        );
    }

    // Variant: Detail (Full Page)
    if (quantity === 0) {
        return (
            <button
                onClick={handleIncrement}
                disabled={!product.stock || product.stock === 0}
                className={`w-full bg-primary hover:bg-white text-secondary font-bold py-4 px-8 rounded-lg shadow-lg flex justify-center items-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                <ShoppingBag size={20} />
                {(!product.stock || product.stock === 0) ? 'Agotado' : 'Añadir al Carrito'}
            </button>
        );
    }

    // Active state Detail
    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between bg-primary/10 border border-primary/50 text-white p-2 rounded-lg mb-2">
                <button
                    onClick={handleDecrement}
                    className="size-12 rounded-lg bg-surface hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                >
                    {quantity === 1 ? <Trash2 size={20} className="text-red-400" /> : <Minus size={20} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-white/50 font-bold uppercase tracking-wider">En Carrito</span>
                    <span className="text-2xl font-bold font-display">{quantity}</span>
                </div>
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= (product.stock || 100)}
                    className="size-12 rounded-lg bg-primary text-secondary hover:bg-white flex items-center justify-center transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={20} />
                </button>
            </div>
            {quantity >= (product.stock || 100) && (
                <div className="text-xs text-center text-red-400 font-bold animate-pulse">
                    ¡Stock máximo alcanzado!
                </div>
            )}
        </div>
    );
};
