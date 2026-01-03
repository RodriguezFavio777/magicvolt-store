import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { HomePage } from './pages/Home';
import { ProductsPage } from './pages/Catalog';
import { CollectionPage } from './pages/Collection';
import { ProductDetailPage } from './pages/ProductDetail';
import { CartPage } from './pages/Cart';
import { LoginPage } from './pages/Login';
import { CheckoutPage } from './pages/Checkout';
import { WarrantyPage, FAQPage, ContactPage } from './pages/InfoPages';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { ProductForm } from './pages/Admin/ProductForm';
import { AdminOrders } from './pages/Admin/Orders';
import { AdminProducts } from './pages/Admin/ProductList';
import { AdminRoute } from './components/AdminRoute';
import { AuthCallback } from './components/AuthCallback';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-secondary text-white font-body selection:bg-primary selection:text-secondary">
            <ScrollToTop />
            <Toaster richColors position="top-center" theme="dark" />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/product-detail" element={<ProductsPage />} /> {/* Fallback redirect or list */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products/new" element={<ProductForm />} />
                <Route path="/admin/products/:id" element={<ProductForm />} />
              </Route>

              {/* Handle Supabase Redirects & 404s */}
              <Route path="*" element={<AuthCallback />} />
            </Routes>
            <Footer />
          </div>
        </HashRouter>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
