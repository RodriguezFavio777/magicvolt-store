import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MiniCart } from './MiniCart';
import { APP_CONFIG } from '../src/constants';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { cartCount } = useCart();
  const { user, role, signOut } = useAuth();

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const [showMiniCart, setShowMiniCart] = useState(false);

  // New Links Structure
  const links = [
    { path: '/', label: 'Inicio' },
    { path: '/collection', label: 'Colección' },
    { path: '/products', label: 'Productos' },
    { path: '/contact', label: 'Contacto' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 whitespace-nowrap border-b border-white/10 bg-secondary/95 backdrop-blur-md shadow-lg transition-all duration-300">

        {/* Main Navbar Content */}
        <div className={`relative flex items-center justify-between px-6 lg:px-10 py-3 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-white hover:text-primary transition-colors p-1 active:scale-95 transform"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </div>

            <Link to="/" className="flex items-center gap-3 text-white group">
              <div className="size-8 text-primary group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold font-display leading-tight tracking-wide text-primary">Magic Volt</h2>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={`${link.path}-${index}`}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-300 relative group/link ${isActive(link.path) ? 'text-primary' : 'text-white/80 hover:text-primary'}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-primary transition-colors hover:scale-110 duration-200"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Cart with MiniCart Click */}
            <div className="relative group">
              <button
                onClick={() => setShowMiniCart(!showMiniCart)}
                className="text-white hover:text-primary transition-colors relative hover:scale-110 duration-200 block py-2"
                aria-label="Toggle Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 -right-1.5 size-3.5 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-secondary animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mini Cart Dropdown */}
              {showMiniCart && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowMiniCart(false)}
                  />
                  <MiniCart onClose={() => setShowMiniCart(false)} />
                </>
              )}
            </div>

            {/* Admin Panel Button - Only if Logged in as Admin */}
            {user && role === 'admin' ? (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 bg-white/10 text-white hover:bg-primary hover:text-secondary px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-primary/20 border border-white/10"
              >
                <User size={16} /> Panel Admin
              </Link>
            ) : null}
          </div>
        </div>

        {/* Search Overlay Bar */}
        <div className={`absolute inset-0 bg-secondary z-50 flex items-center px-6 lg:px-10 transition-transform duration-300 ease-out ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-4">
            <Search className="text-primary shrink-0" size={24} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos (ej. Anillo, Plata...)"
              className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/30 font-display"
            />
            <button
              type="submit"
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors"
            >
              Buscar <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={closeSearch}
              className="p-2 text-white/60 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
      </div>

      <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm z-[61] bg-secondary shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <span className="text-xl font-bold font-display text-primary">Magic Volt</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white p-2 hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} />
            </button>
          </div>

          {/* Mobile Search inside Menu */}
          <form onSubmit={(e) => {
            handleSearchSubmit(e);
            setMobileMenuOpen(false);
          }} className="mb-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-surface border border-white/10 rounded-lg py-3 px-4 pl-10 text-white outline-none focus:border-primary transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </form>

          <nav className="flex flex-col gap-6">
            {links.map((link, index) => (
              <Link
                key={`mobile-${index}`}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl font-display font-bold hover:text-primary hover:translate-x-2 transition-all duration-300 ${isActive(link.path) ? 'text-primary' : 'text-white'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}

          </nav>

          <div className="mt-auto border-t border-white/10 pt-8 pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-4 text-white/60">
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Preguntas Frecuentes</Link>
              <Link to="/warranty" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Garantía</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-white/10 bg-secondary py-12 text-white relative animate-fade-in">
    <div className="max-w-[1440px] mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between gap-8">
      <div>
        <h2 className="text-primary font-display text-xl font-bold mb-2 tracking-wide">Magic Volt</h2>
        <p className="text-white/60 text-sm">© 2024 Magic Volt. Elegancia Atemporal.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 text-sm text-white/60">
        <Link to="/faq" className="hover:text-primary transition-colors hover:translate-y-[-2px] inline-block">Preguntas Frecuentes</Link>
        <Link to="/warranty" className="hover:text-primary transition-colors hover:translate-y-[-2px] inline-block">Garantía y Devoluciones</Link>
        <Link to="/contact" className="hover:text-primary transition-colors hover:translate-y-[-2px] inline-block">Contacto</Link>
      </div>
    </div>

    {/* WhatsApp Floating Button with animation */}
    <a
      href={`https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=Hola!%20Me%20gustar%C3%ADa%20hacer%20una%20consulta.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-16 h-16 drop-shadow-xl relative z-10"
      />
    </a>
  </footer>
);
