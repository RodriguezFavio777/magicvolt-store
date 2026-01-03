export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'Anillos' | 'Collares' | 'Pulseras' | 'Aretes' | 'Gafas';
  description: string;
  badge?: string;
  rating?: number;
  material?: string;
  stock?: number;
  new_collection?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface NavLink {
  path: string;
  label: string;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address?: string; // Legacy
  city?: string; // Legacy
  postalCode: string; // Used in both (mapped from codigoPostal or direct)
  phone: string;
  calle?: string;
  altura?: string;
  piso?: string;
  depto?: string;
  provincia?: string;
  formatted?: string;
  [key: string]: any; // Allow flexibility for JSONB
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  shippingAddress?: ShippingAddress;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
}

export interface Order {
  id: string; // Supabase IDs are strings (UUIDs)
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: ShippingAddress | any; // Allow any for simpler handling of legacy vs new
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  order_items?: OrderItem[]; // Joined from query
  items?: OrderItem[]; // Legacy prop if used
}