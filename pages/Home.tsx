import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { AddToCartBtn } from '../components/AddToCartBtn';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      // Order by sold_quantity desc for Best Sellers
      const { data } = await supabase.from('products').select('*').order('sold_quantity', { ascending: false }).limit(9);
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prev => (prev + 3 >= products.length ? 0 : prev + 3));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length, isPaused]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] animate-fade-in">
      <main className="flex-1 bg-surface dark:bg-secondary">
        <section className="px-4 py-6 md:px-10 lg:px-20 bg-secondary">
          <div
            className="relative w-full overflow-hidden rounded-xl min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-cover bg-center border border-slate-700/50 transform transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCd8bOZKqYbtqsY8Sis1CuGIlGoa921OFmRcaqhTMBd9XpX1mRbIKo9w18avIJeAjoyF2pd-pwsNvGZrZ5rCDMcU7941EZyrkgVTfD1GsIKMKhclKkmoqyd5-J7cHjdosFaoFZxENhQdXtqxxINpConedAKVpJVfQOoN5ly1eGVsMQ4Ff2CtpCVCFa3sCxhxByLgfwl0P_IYdnlDS1QPs8i7_19-sQMVinY61zevwVSsyNDML63OtIEv0UlZs-mExtoappem1dDVyDH')" }}
          >
            <div className="max-w-3xl flex flex-col gap-6 animate-fade-in-up">
              <h1 className="text-white font-display text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg">
                Redefine tu Esencia
              </h1>
              <h2 className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md delay-100">
                La elegancia es un acto de rebeldía. Piezas icónicas en Plata y Acero para quienes marcan su propio camino.
              </h2>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center delay-200">
                <button
                  onClick={() => navigate('/collection')}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-secondary transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg shadow-primary/20 active:scale-95"
                >
                  Ver Nueva Colección
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-transparent px-8 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white active:scale-95"
                >
                  Todo el Catálogo
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full">
          <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-3xl font-display font-bold tracking-tight text-white">Más Vendidos</h2>
            <p className="text-slate-400 mt-2">Piezas imprescindibles para nuestra comunidad</p>
          </div>

          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 transition-all duration-700 ease-in-out">
              {products.length > 0 ? (
                products.slice(currentIndex, currentIndex + 3).map((product, index) => (
                  <div
                    key={product.id}
                    className={`group flex flex-col gap-4 cursor-pointer animate-fade-in-up ${product.stock === 0 ? 'opacity-60 pointer-events-none grayscale' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square bg-surface/50 rounded-2xl overflow-hidden relative shadow-sm border border-white/5 group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
                      {product.stock === 0 ? (
                        <div className="absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full bg-red-600 text-white shadow-md uppercase tracking-wider">
                          Agotado
                        </div>
                      ) : product.stock && product.stock < 3 ? (
                        <div className="absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500 text-white shadow-md uppercase tracking-wider">
                          ¡Pocas Unidades!
                        </div>
                      ) : null}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Add To Cart Button */}
                      {product.stock !== 0 && (
                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <AddToCartBtn
                            product={product}
                            variant="catalog"
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">{product.name}</h3>
                        <span className="font-bold text-lg text-white font-display text-nowrap ml-4">${product.price}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-white/50 border border-white/10 rounded-2xl bg-surface/30">
                  <p>Cargando productos destacados...</p>
                </div>
              )}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(products.length / 3) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * 3)}
                  className={`size-3 rounded-full transition-all ${Math.floor(currentIndex / 3) === idx ? 'bg-primary scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Ir a página ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div >
  );
};
