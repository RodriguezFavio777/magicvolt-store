import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ShoppingBag, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { AddToCartBtn } from '../components/AddToCartBtn';

const ITEMS_PER_PAGE = 12;

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // States for filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all'); // all, under100, 100to300, over300
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  // Fetch Products with Server-Side Filtering & Pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // 1. Search Filter
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // 2. Category Filter
      if (selectedCategories.length > 0) {
        let categoriesToSearch = [...selectedCategories];
        // Synonyms mapping
        if (selectedCategories.includes('Aretes')) categoriesToSearch.push('Aros');
        if (selectedCategories.includes('Collares')) categoriesToSearch.push('Chokers');

        query = query.in('category', categoriesToSearch);
      }

      // 3. Price Filter
      if (priceRange === 'under100') {
        query = query.lt('price', 100);
      } else if (priceRange === '100to300') {
        query = query.gte('price', 100).lte('price', 300);
      } else if (priceRange === 'over300') {
        query = query.gt('price', 300);
      }

      // 4. Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      query = query
        .order('id', { ascending: true }) // Consistent ordering
        .range(from, to);

      const { data, error, count } = await query;

      if (!error && data) {
        setProducts(data);
        if (count !== null) setTotalCount(count);
      } else {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    fetchProducts();
  }, [currentPage, searchQuery, selectedCategories, priceRange]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, priceRange]);


  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange('all');
    setSearchParams({}); // Clear search param too
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const categories = ['Anillos', 'Collares', 'Pulseras', 'Aretes', 'Gafas', 'Conjuntos'];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Nuestros Productos'}
            </h1>
            <p className="text-white/60">
              {searchQuery ? 'Explora lo que hemos encontrado para ti.' : 'Explora nuestra colección completa de joyería artesanal.'}
            </p>
          </div>
          <button
            className="lg:hidden flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-white font-bold hover:bg-white/20 transition-colors active:scale-95"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">

          {/* Filters Sidebar (Desktop) & Mobile Overlay */}
          <div
            className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileFiltersOpen(false)}
          ></div>

          <aside className={`
            fixed inset-0 z-[51] bg-secondary p-6 transform transition-transform duration-300 lg:static lg:bg-transparent lg:p-0 lg:translate-x-0 lg:w-64 lg:block
            ${mobileFiltersOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-white">Filtros</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:rotate-90 transition-transform"><X className="text-white" /></button>
            </div>

            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Categoría</h3>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group/item hover:translate-x-1 transition-transform">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 text-primary bg-transparent focus:ring-primary/50 size-4 accent-primary"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className={`text-sm transition-colors duration-200 ${selectedCategories.includes(cat) ? 'text-white font-bold' : 'text-white/60 group-hover/item:text-white'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>

              {/* Price Filter */}
              <div className="space-y-3 pt-4 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Precio</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { val: 'all', label: 'Todos' },
                    { val: 'under100', label: 'Menos de $100' },
                    { val: '100to300', label: '$100 - $300' },
                    { val: 'over300', label: 'Más de $300' }
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center gap-3 cursor-pointer group/item hover:translate-x-1 transition-transform">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary bg-transparent focus:ring-primary/50 accent-primary"
                        checked={priceRange === opt.val}
                        onChange={() => setPriceRange(opt.val)}
                      />
                      <span className={`text-sm transition-colors duration-200 ${priceRange === opt.val ? 'text-white font-bold' : 'text-white/60 group-hover/item:text-white'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="lg:hidden w-full bg-primary text-secondary font-bold py-3 rounded-lg mt-8 active:scale-95 transition-transform"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Ver Resultados
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Skeleton Loading */}
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="aspect-square bg-surface/50 rounded-2xl"></div>
                    <div className="h-4 bg-surface/50 rounded w-3/4"></div>
                    <div className="h-4 bg-surface/50 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-6 animate-fade-in">
                  <p className="text-sm text-white/60 font-medium">
                    Mostrando <span className="text-white font-bold">{products.length}</span> de <span className="text-white font-bold">{totalCount}</span> resultados
                  </p>
                </div>

                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {products.map((product, index) => (
                        <div
                          key={`prod-${product.id}`}
                          className={`group flex flex-col gap-4 cursor-pointer animate-fade-in-up ${product.stock === 0 ? 'opacity-60 pointer-events-none grayscale' : ''}`}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="aspect-square bg-surface/50 rounded-2xl overflow-hidden relative shadow-sm border border-white/5 group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                              {product.badge && product.stock !== 0 && (
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md w-fit ${product.badge === 'Nuevo' ? 'bg-black text-white' : 'bg-primary text-secondary'}`}>
                                  {product.badge}
                                </span>
                              )}
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
                              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              decoding="async"
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
                              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                              <p className="text-lg font-bold text-white font-display whitespace-nowrap">${product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-12 flex justify-center items-center gap-4 animate-fade-in-up">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-3 bg-surface border border-white/10 rounded-full hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft size={20} className={currentPage === 1 ? "text-white/30" : "text-primary"} />
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Using basic array for now to ensure stability */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                            Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
                            Math.min(totalPages, Math.max(5, currentPage + 2))
                          ).map((page) => (
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
                  </>
                ) : (
                  <div className="w-full py-20 text-center border border-white/10 rounded-xl bg-surface/30 animate-fade-in-up">
                    <p className="text-xl text-white font-display font-bold mb-2">No se encontraron productos</p>
                    <p className="text-white/60">
                      {searchQuery ? `No hay resultados para "${searchQuery}".` : 'Intenta ajustar tus filtros para encontrar lo que buscas.'}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-primary underline hover:text-white transition-colors"
                    >
                      Limpiar Filtros y Búsqueda
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};