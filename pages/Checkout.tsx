import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { APP_CONFIG, FIELD_MESSAGES } from '../src/constants';

export const CheckoutPage: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    calle: '',
    altura: '',
    piso: '',
    depto: '',
    provincia: '',
    codigoPostal: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getInputClass = (name: keyof typeof formData, required = true) => {
    const value = formData[name];
    const baseClass = "w-full rounded-lg border bg-surface text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30";

    // Neutral at start (submitted=false, empty)
    if (!submitted && !value) return `${baseClass} border-white/20`;

    // Error (submitted=true, empty & required)
    if (submitted && required && !value) return `${baseClass} border-red-500`;

    // Specific email validation
    if (name === 'email' && value && !validateEmail(value)) return `${baseClass} border-red-500`;

    // Success (not empty)
    if (value) return `${baseClass} border-green-500`;

    // Default Neutral
    return `${baseClass} border-white/20`;
  };

  const handlePlaceOrder = async () => {
    setSubmitted(true);

    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.calle || !formData.altura || !formData.provincia || !formData.codigoPostal || !formData.phone) {
      toast.warning(FIELD_MESSAGES.REQUIRED);
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error(FIELD_MESSAGES.INVALID_EMAIL);
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const orderData = {
        user_id: user?.id || null,
        status: 'pending',
        total_amount: cartTotal,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          calle: formData.calle,
          altura: formData.altura,
          piso: formData.piso,
          depto: formData.depto,
          provincia: formData.provincia,
          codigoPostal: formData.codigoPostal,
          phone: formData.phone,
          email: formData.email,
          formatted: `${formData.calle} ${formData.altura}${formData.piso ? `, Piso ${formData.piso}` : ''}${formData.depto ? `, Depto ${formData.depto}` : ''}, ${formData.codigoPostal}, ${formData.provincia}`
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const ownerPhone = APP_CONFIG.WHATSAPP_NUMBER;
      const message = `hola soy ${formData.firstName} ${formData.lastName}, mi numero de pedido es #${order.id.slice(0, 8)} - Quiero coordinar el envío y el pago.`;
      const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;

      clearCart();
      setFormData({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        calle: '',
        altura: '',
        piso: '',
        depto: '',
        provincia: '',
        codigoPostal: ''
      });
      setSubmitted(false);
      window.open(whatsappUrl, '_blank');
      toast.success('¡Pedido iniciado! Continúa en WhatsApp.');

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-secondary min-h-screen">
      <Link to="/cart" className="inline-flex items-center gap-2 text-white/60 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={18} /> Volver al carrito
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-10">

          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-secondary text-xs">1</span>
              Información de Contacto
            </h2>
            <div className="space-y-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={getInputClass('email')}
                placeholder="ejemplo@correo.com"
                type="email"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={getInputClass('phone')}
                placeholder="Teléfono (para WhatsApp)"
                type="tel"
                required
              />
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-secondary text-xs">2</span>
              Dirección de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={getInputClass('firstName')}
                placeholder="Nombre"
                type="text"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={getInputClass('lastName')}
                placeholder="Apellidos"
                type="text"
                required
              />
              <input
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                className={`${getInputClass('calle')} md:col-span-1`}
                placeholder="Calle"
                type="text"
                required
              />
              <input
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                className={`${getInputClass('altura')} md:col-span-1`}
                placeholder="Altura / Número"
                type="text"
                required
              />
              <input
                name="piso"
                value={formData.piso}
                onChange={handleChange}
                className={`${getInputClass('piso', false)} md:col-span-1`}
                placeholder="Piso (Opcional)"
                type="text"
              />
              <input
                name="depto"
                value={formData.depto}
                onChange={handleChange}
                className={`${getInputClass('depto', false)} md:col-span-1`}
                placeholder="Depto (Opcional)"
                type="text"
              />
              <input
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className={getInputClass('provincia')}
                placeholder="Provincia"
                type="text"
                required
              />
              <input
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                className={getInputClass('codigoPostal')}
                placeholder="Código Postal"
                type="text"
                required
              />
            </div>
          </section>

          <div>
            <button
              disabled={items.length === 0 || loading}
              onClick={handlePlaceOrder}
              className="w-full bg-primary hover:bg-white text-secondary font-bold py-4 px-6 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              <span>{loading ? 'Procesando...' : `Pagar $${cartTotal.toFixed(2)}`}</span>
            </button>
            <p className="text-center text-white/50 text-sm mt-4">
              Serás redirigido a WhatsApp para finalizar tu compra con un asesor.
            </p>
          </div>

        </div>

        {/* Order Summary */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="bg-surface p-8 rounded-2xl border border-white/10 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Tu Pedido ({items.length})</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="size-16 rounded-md bg-white/5 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <p className="text-xs text-white/50">Cant: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Envío</span>
                <span className={cartTotal > 100000 ? "text-green-400" : "text-white/60"}>
                  {cartTotal > 100000 ? "Gratis" : "A convenir"}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-2">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div >
    </main >
  );
};
