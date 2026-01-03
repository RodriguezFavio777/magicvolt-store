import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  // ... keep existing lines correct ... (I will use a wider range to be safe or just target specific blocks)
  // Actually, let's just fix the top first.

  cartItems: CartItem[]; // Alias for compatibility
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('magic-volt-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'magic-volt-cart') {
        try {
          const newItems = e.newValue ? JSON.parse(e.newValue) : [];
          setItems(newItems);
        } catch (error) {
          console.error('Error syncing cart across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('magic-volt-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const stock = product.stock ?? 100; // Fallback if undefined

      if (currentQty + 1 > stock) {
        toast.error(`Sorry, only ${stock} items available`);
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setItems(currentItems => currentItems.map(item => {
      if (item.id === id) {
        const productStock = item.stock ?? 100;
        const newQuantity = item.quantity + change;

        if (newQuantity > productStock) {
          toast.error(`Solo hay ${productStock} unidades disponibles`);
          return item;
        }

        const validQuantity = Math.max(1, newQuantity);
        return { ...item, quantity: validQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, cartItems: items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};