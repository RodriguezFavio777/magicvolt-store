import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const ITEMS_PER_PAGE = 12;

export const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);

      // Calculate range
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Get count first (or simultaneously)
      const countQuery = supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('new_collection', true);

      // Get Data
      const dataQuery = supabase
        .from('products')
        .select('*')
        .eq('new_collection', true)
        .range(from, to)
        .order('id', { ascending: true }); // Ensure consistent ordering

      const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

      if (countResult.count) {
        setTotalPages(Math.ceil(countResult.count / ITEMS_PER_PAGE));
      }

      if (!dataResult.error && dataResult.data) {
        setCollectionProducts(dataResult.data);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    fetchCollection();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <main className="flex-1 w-full">
        {/* Collection Hero */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDq66L9CTgcUbQXiPR3T_HgLWXyhnB0dNwcqKH1kxtR6sfJ3qbUx0fx7RUUj3H-y1ia8h5jasaOkGSaX9U0ASmNpSlja6Ab4GO5j0GKIHTPXNMGz4LRq1ehJkLHvUOGtmv_2VfNetiT8ZpwlGSX3XVcJxkumbBodl1zoejZ8SOZy78CmjqhL6Jh1P3YGQNZBSCNiR533PzkcDdWHCFIWacUAEc1ADGzm7N9p_EckVbk3if1YU9vLWGZjuNX1jtHvFdLlIp-XOBuNiB9')" }}></div>
          <div className="absolute inset-0 bg-secondary/60"></div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
            <span className="text-primary font-bold tracking-[0.2em] uppercase mb-4 block animate-slide-in-right">Temporada 2026</span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-tight">
              Colección <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Eterna</span>
            </h1>
            <p className="text-xl text-slate-200 font-light max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Piezas diseñadas para trascender el tiempo. Una fusión de arquitectura moderna y artesanía tradicional.
            </p>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="py-20 px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div>
              <h2 className="text-3xl font-display font-bold text-white">Nuevos Lanzamientos</h2>
              <p className="text-white/60 mt-2">Recién salidos del taller.</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-bold hover:translate-x-2 duration-300"
            >
              Ver todo el catálogo <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 min-h-[400px]">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="aspect-square bg-surface/50 rounded-2xl"></div>
                  <div className="h-4 bg-surface/50 rounded w-3/4"></div>
                  <div className="h-4 bg-surface/50 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              collectionProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group flex flex-col gap-4 cursor-pointer animate-fade-in-up ${product.stock === 0 ? 'opacity-60 pointer-events-none grayscale' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="aspect-square bg-surface/50 rounded-2xl overflow-hidden relative shadow-sm border border-white/5 group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <span className="bg-white text-secondary text-[10px] font-black px-3 py-1 uppercase tracking-wider shadow-sm w-fit rounded-full">
                        New Drop
                      </span>
                      {product.stock === 0 ? (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md w-fit">
                          Agotado
                        </span>
                      ) : product.stock && product.stock < 3 ? (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md w-fit">
                          ¡Pocas Unidades!
                        </span>
                      ) : null}
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Add To Cart Button */}
                    {product.stock !== 0 && (
                      <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="bg-primary hover:bg-white text-secondary p-3 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                          <ShoppingBag size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">{product.name}</h3>
                      <span className="font-bold text-lg text-white font-display text-nowrap ml-4">${product.price}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4 animate-fade-in-up">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-surface border border-white/10 rounded-full hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} className={currentPage === 1 ? "text-white/30" : "text-primary"} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${currentPage === page
                      ? 'bg-primary text-secondary scale-110 shadow-lg shadow-primary/20'
                      : 'bg-surface border border-white/10 text-white hover:border-primary/50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-surface border border-white/10 rounded-full hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} className={currentPage === totalPages ? "text-white/30" : "text-primary"} />
              </button>
            </div>
          )}

          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="p-10 bg-surface border border-white/10 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-2xl font-bold text-white mb-4">¿Buscas algo más específico?</h3>
                <p className="text-white/60 mb-6 max-w-md">Nuestro catálogo completo incluye clásicos atemporales y piezas exclusivas.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-3 bg-transparent border border-white/30 hover:border-primary hover:text-primary text-white font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Explorar Catálogo Completo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
