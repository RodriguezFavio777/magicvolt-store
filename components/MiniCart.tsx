import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MiniCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { cartItems, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="absolute top-full right-0 mt-4 w-80 bg-secondary border border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-fade-in origin-top-right z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:bg-transparent">
                <ShoppingBag className="mx-auto text-white/20 mb-3" size={48} />
                <p className="text-white/60 mb-4">Tu carrito está vacío.</p>
                <Link
                    to="/products"
                    onClick={onClose}
                    className="inline-block text-primary font-bold hover:underline"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="fixed left-0 right-0 top-20 mx-auto w-[90%] max-w-[400px] max-h-[80vh] md:absolute md:top-full md:right-0 md:left-auto md:w-96 md:h-auto md:max-h-none md:mx-0 bg-secondary border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50 flex flex-col md:origin-top-right">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <ShoppingBag size={18} className="text-primary" />
                    Mi Carrito ({cartItems.length})
                </h3>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <div className="size-16 rounded-md bg-white/5 overflow-hidden shrink-0 border border-white/5">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                            <p className="text-xs text-white/50 mb-1">{item.category}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/70">Cant: <span className="text-white font-bold">{item.quantity}</span></span>
                                <span className="text-sm font-mono text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                            }}
                            className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all self-center"
                            title="Eliminar"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-surface space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-white/60 text-sm">Total Estimado</span>
                    <span className="text-xl font-display font-bold text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => {
                        onClose();
                        navigate('/checkout');
                    }}
                    className="w-full bg-primary text-secondary font-bold py-3 rounded-xl hover:bg-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
                >
                    Checkout <ArrowRight size={18} />
                </button>
                <Link
                    to="/cart"
                    onClick={onClose}
                    className="block text-center text-xs text-white/40 hover:text-white transition-colors"
                >
                    Ver Carrito Completo
                </Link>
            </div>
        </div>
    );
};
