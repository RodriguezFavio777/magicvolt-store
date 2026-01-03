import React, { useState } from 'react';
import { ChevronDown, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../src/constants';

export const WarrantyPage: React.FC = () => {
  // ... (rest of WarrantyPage)
  // Actually I should not replace the whole file if I can avoid it.
  // I will target the imports and ContactPage separately.
  // Wait, the tool requires contiguous blocks. I'll split this.
  return (
    <main className="flex-grow min-h-screen">
      <section className="relative w-full">
        <div
          className="w-full h-[300px] bg-cover bg-center relative flex items-center justify-center text-center px-6"
          style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD15wcZIWELQQQ7wRRw2NdF6Mqhi2GCpdcXXy6ABjTS14LONtVR-UwPXseN0w0XhJ4GKGPs4__zKk5rTbwFWoTLmswil-XKE41FgW8qBk-a9D_D8OfoXMe8UtZ4b9tQxdFsd8CN0TTaGSnvtje6mNfAIsENPdT01nSizkbIEQ8ZQuX3ycDQvVHCZC9r34Rwy8uYDNH6m2o0rg1jKgUqqCb_SfDPC4UpDH6Md5v0oHH2NbsHR0bih0hEchSayC4nsevEzwY3mGyNA6k_')" }}
        >
          <div className="max-w-4xl">
            <h1 className="text-white font-display text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">Garantía y Devoluciones</h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto font-medium">Compra con tranquilidad. Tu satisfacción es nuestra prioridad.</p>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-xl mb-3 text-white text-primary">Garantía Legal de 3 Meses</h3>
            <p className="text-base text-gray-400 leading-relaxed">Cobertura total ante cualquier falla de fabricación o material. Nos aseguramos de que cada pieza cumpla con nuestros estándares de excelencia.</p>
          </div>
          <div className="bg-surface p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
            <h3 className="font-bold text-xl mb-3 text-white text-primary">Devoluciones Fáciles</h3>
            <p className="text-base text-gray-400 leading-relaxed">Si no te enamora, lo cambiamos. Tienes 7 días para realizar cambios. Cobertura total por defectos de fábrica.</p>
          </div>
        </div>
      </section>
    </main>
  )
};

export const FAQPage: React.FC = () => {
  return (
    <main className="flex-grow min-h-screen bg-secondary">
      <div className="w-full py-16 text-center">
        <h1 className="text-white font-display text-4xl md:text-5xl font-black mb-4"><span className="text-primary">¿Cómo</span> podemos ayudarte?</h1>
      </div>
      <div className="max-w-[800px] mx-auto px-6 pb-20 flex flex-col gap-4">
        <details className="group bg-surface rounded-lg border border-white/10 p-5 cursor-pointer open:border-primary/50 transition-all">
          <summary className="flex justify-between items-center text-white font-semibold text-lg list-none">
            ¿Cuánto tarda en llegar mi pedido?
            <ChevronDown className="transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="text-gray-300 mt-4 leading-relaxed pl-1">
            Para <strong>CABA y GBA</strong>, entregamos en 1 día hábil. <br />
            Para el <strong>resto del país</strong>, el tiempo estándar es de 3 a 7 días hábiles dependiendo de la localidad.
          </p>
        </details>

        <details className="group bg-surface rounded-lg border border-white/10 p-5 cursor-pointer open:border-primary/50 transition-all">
          <summary className="flex justify-between items-center text-white font-semibold text-lg list-none">
            ¿Qué métodos de pago aceptan?
            <ChevronDown className="transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="text-gray-300 mt-4 leading-relaxed pl-1">
            Puedes abonar con tarjeta de crédito, débito o dinero en cuenta a través de <strong>Mercado Pago</strong>, o mediante transferencia bancaria con descuento especial.
          </p>
        </details>

        <details className="group bg-surface rounded-lg border border-white/10 p-5 cursor-pointer open:border-primary/50 transition-all">
          <summary className="flex justify-between items-center text-white font-semibold text-lg list-none">
            ¿Cómo cuido mis joyas?
            <ChevronDown className="transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="text-gray-300 mt-4 leading-relaxed pl-1">
            Recomendamos guardarlas en su estuche original, evitar el contacto directo con perfumes o químicos fuertes y limpiarlas suavemente con un paño seco para mantener su brillo intacto.
          </p>
        </details>
      </div>
    </main>
  )
};

export const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getInputClass = (value: string) => {
    const baseClass = "w-full rounded-lg border bg-secondary p-3 text-white focus:border-primary outline-none transition-colors";

    // Neutral at start
    if (!submitted && !value) return `${baseClass} border-white/20`;

    // Error
    if (submitted && !value) return `${baseClass} border-red-500`;

    // Success
    if (value) return `${baseClass} border-green-500`;

    return `${baseClass} border-white/20`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setLoading(true);
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'contact_form',
          payload: formData
        }
      });
      setSent(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow min-h-screen bg-secondary">
      <section className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">Estamos aquí para ayudarte</h1>
        <p className="text-white/60">Cuéntanos qué necesitas y te responderemos a la brevedad.</p>
      </section>
      <div className="max-w-[1120px] mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-12">
        <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-xl">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in p-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
              <p className="text-white/60 mb-8">Gracias por contactarnos. Nuestro equipo te responderá lo antes posible.</p>
              <button
                onClick={() => setSent(false)}
                className="text-primary hover:text-white underline transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Tu Nombre</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={getInputClass(formData.name)}
                  placeholder="Nombre completo"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Correo Electrónico</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass(formData.email)}
                  placeholder="ejemplo@correo.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Teléfono</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={getInputClass(formData.phone)}
                  placeholder="+54 9 11..."
                  type="tel"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={getInputClass(formData.message)}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                ></textarea>
              </div>
              <button disabled={loading} className="w-full bg-primary hover:bg-white text-secondary font-bold py-4 px-6 rounded-lg transition-all shadow-lg transform active:scale-[0.99] disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-white/10 p-8 text-white h-full flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-2xl mb-2 text-primary">Atención al Cliente</h3>
            <p className="text-white/60 mb-6">Estamos disponibles de Lunes a Viernes de 9:00 a 18:00 hrs.</p>
            <button
              onClick={() => window.open(`https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=Hola,%20necesito%20asistencia%20con%20un%20pedido`, '_blank')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <MessageCircle size={20} />
              Chat por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>
  )
};