import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { AddToCartBtn } from '../components/AddToCartBtn';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Zoom Logic
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState({ show: false, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();

    // Calculate cursor position in %
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // Clamp values (0-100)
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setZoomState({ show: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoomState({ ...zoomState, show: false });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProduct(data);

        // Fetch "Related" products that are IN STOCK
        const { data: allProducts } = await supabase
          .from('products')
          .select('*')
          .neq('id', data.id)
          .gt('stock', 0)
          .limit(12);

        if (allProducts) {
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          setRelatedProducts(shuffled.slice(0, 4));
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-secondary"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-8 text-center animate-fade-in">
        <div className="bg-white/5 p-6 rounded-full mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Producto no encontrado</h1>
        <p className="text-white/60 mb-8 max-w-md">
          Lo sentimos, parece que el producto que buscas ya no está disponible o el enlace es incorrecto.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-secondary px-8 py-3 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <main className="flex h-full grow flex-col px-4 md:px-10 py-5 mx-auto w-full max-w-[1440px]">
      <div className="flex flex-wrap gap-2 px-4 py-4 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <Link to="/" className="text-slate-400 text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
        <span className="text-slate-400 text-sm font-medium">/</span>
        <Link to="/products" className="text-slate-400 text-sm font-medium hover:text-primary transition-colors">{product.category}</Link>
        <span className="text-slate-400 text-sm font-medium">/</span>
        <span className="text-white text-sm font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 px-4 pb-12">
        {/* Images with Zoom Lens */}
        <div className="lg:col-span-7 flex flex-col gap-4 animate-fade-in-up relative z-20" style={{ animationDelay: '200ms' }}>
          <div
            ref={imgContainerRef}
            className="relative group w-full aspect-square sm:aspect-[4/5] lg:aspect-[4/3] overflow-hidden rounded-3xl bg-secondary border border-white/5 shadow-2xl flex items-center justify-center cursor-crosshair z-10"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover lg:object-contain"
            />

            {/* Mobile/Tablet Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="inline-flex items-center rounded-full bg-black/80 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Desktop Lens (follows cursor) */}
            {zoomState.show && (
              <div
                className="hidden lg:block absolute pointer-events-none border border-primary/50 bg-white/20 backdrop-blur-[2px] shadow-sm z-20"
                style={{
                  top: `${zoomState.y}%`,
                  left: `${zoomState.x}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '40%',
                  height: '50%',
                }}
              />
            )}
          </div>

          {/* Desktop Zoom Flyout Portal (Appears over text column) */}
          {zoomState.show && (
            <div
              className="hidden lg:block absolute z-50 overflow-hidden rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-secondary"
              style={{
                top: 0,
                left: '102%',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${product.image})`,
                backgroundPosition: `${zoomState.x}% ${zoomState.y}%`,
                backgroundSize: '180%',
                backgroundRepeat: 'no-repeat'
              }}
            >
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-5 relative animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary text-sm font-bold tracking-wider uppercase">{product.category} Premium</span>
                <div className="flex items-center gap-1 text-primary">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-white">{product.rating || '5.0'}</span>
                </div>
              </div>
              <h1 className="text-white font-display tracking-tight text-4xl md:text-5xl font-bold leading-tight mb-4">{product.name}</h1>
              <div className="flex items-end gap-3 font-display">
                <p className="text-primary text-3xl font-bold">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-slate-500 text-lg mb-1 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className={`p-4 rounded-lg border text-sm mb-2 ${!product.stock || product.stock === 0
              ? 'border-red-500/30 bg-red-500/10 text-red-400'
              : product.stock < 3
                ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                : 'border-green-500/30 bg-green-500/10 text-green-400'
              }`}>
              {!product.stock || product.stock === 0
                ? 'Producto Agotado momentáneamente.'
                : product.stock < 3
                  ? '¡Quedan pocas unidades!'
                  : 'Disponible en stock.'}
            </div>

            <div className="flex flex-col gap-3">
              <AddToCartBtn product={product} variant="detail" />
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 mt-2 justify-center border-b border-white/10 pb-6">
              <span className="flex items-center gap-1.5"><Truck size={16} /> Envío Gratis en compras +$100.000</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> Garantía de por vida</span>
            </div>

            <div className="space-y-4 text-sm text-white/70">
              {/* Payment & Shipping Info */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5 w-6 flex justify-center">
                    <span className="text-lg">📲</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Finalización por WhatsApp</h4>
                    <p className="text-xs leading-relaxed">
                      Al confirmar tu pedido, finalizarás la compra directamente con un asesor.
                      <strong>No solicitamos datos bancarios</strong> a través de la web para tu seguridad.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5 w-6 flex justify-center">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Métodos de Pago</h4>
                    <p className="text-xs leading-relaxed">
                      Aceptamos <strong>Mercado Pago</strong> o transferencia desde cualquier entidad bancaria.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5 w-6 flex justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Envíos a todo el país</h4>
                    <p className="text-xs leading-relaxed">
                      Realizamos despachos a toda Argentina a través de <strong>Andreani</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t border-white/10 pt-16 pb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl font-display font-bold text-white mb-8">También te podría gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <div
                key={p.id}
                className="group cursor-pointer flex flex-col gap-2"
                onClick={() => {
                  navigate(`/product/${p.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="relative aspect-[4/5] bg-surface rounded-xl overflow-hidden border border-white/5 shadow-sm hover:shadow-xl transition-all">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <AddToCartBtn product={p} variant="catalog" className="absolute bottom-3 right-3" />
                </div>
                <div>
                  <h3 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                  <p className="text-primary font-bold font-display">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
