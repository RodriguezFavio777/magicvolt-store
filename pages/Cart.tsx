import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8 lg:py-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2 pb-4 border-b border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">Tu Carrito</h2>
            <p className="text-gray-400">Tienes {items.length} artículos en tu bolsa.</p>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-5 p-4 bg-surface rounded-xl border border-transparent hover:border-white/10 transition-all">
              <div className="shrink-0 relative overflow-hidden rounded-lg w-full sm:w-[120px] aspect-square">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/40 hover:text-red-500 transition-colors p-1"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center bg-secondary rounded-lg border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 text-white/70 hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white select-none">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className={`p-2 transition-colors cursor-pointer ${item.quantity >= (item.stock || 100) ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:text-primary'}`}
                      disabled={item.quantity >= (item.stock || 100)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {item.quantity >= (item.stock || 100) && (
                    <span className="text-xs text-red-500 font-bold ml-2">Máx. stock alcanzado</span>
                  )}
                  <span className="block text-lg font-bold text-white font-display">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-12 text-center bg-surface/50 rounded-xl border border-dashed border-white/10">
              <p className="text-white/60 text-lg mb-4">Tu carrito está vacío</p>
              <button
                onClick={() => navigate('/products')}
                className="text-primary font-bold hover:underline"
              >
                Explorar la colección
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-6 p-6 bg-surface border border-white/10 rounded-2xl sticky top-24">
            <h3 className="text-xl font-bold text-white">Resumen</h3>
            <div className="border-b border-white/10 pb-6 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-base font-medium text-white/70">Subtotal</span>
                <span className="text-lg font-bold text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-base font-medium text-white/70">Envío</span>
                <span className={`text-lg font-bold ${cartTotal > 100000 ? 'text-green-400' : 'text-white/60'}`}>
                  {cartTotal > 100000 ? 'Gratis' : 'Por calcular'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-lg font-bold text-white">Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-white font-display">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className={`w-full bg-primary hover:bg-white text-secondary font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>FINALIZAR COMPRA</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};