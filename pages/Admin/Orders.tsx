import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Trash2, CheckCircle, XCircle, ShoppingBag, Eye, Calendar, User, MapPin, Phone, Mail, Check, X } from 'lucide-react';
import { Order } from '../../types';
import { toast } from 'sonner';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, product:products(name, image))')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            console.log('Orders fetched:', data);
            setOrders(data || []);
        }
        setLoading(false);
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleConfirmOrder = (order: Order) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Pedido',
            message: `¿Estás seguro de que deseas confirmar el pedido #${order.id.slice(0, 8)}? Esto descontará el stock.`,
            isDestructive: false,
            onConfirm: async () => await executeConfirmOrder(order)
        });
    };

    const executeConfirmOrder = async (order: Order) => {
        closeModal();
        setProcessing(order.id);
        const toastId = toast.loading('Confirmando pedido...');

        try {
            const items = order.order_items || [];
            if (items.length === 0) throw new Error('El pedido no tiene ítems.');

            // Deduct Stock
            for (const item of items) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    row_id: item.product_id,
                    quantity_to_decrement: item.quantity
                });
                if (stockError) throw stockError;

                const { error: salesError } = await supabase.rpc('increment_sales', {
                    row_id: item.product_id,
                    quantity: item.quantity
                });
                if (salesError) console.error('Error incrementing sales:', salesError);
            }

            // Update Order Status
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', order.id);

            if (updateError) throw updateError;

            const updatedOrder = { ...order, status: 'completed' } as Order;
            setOrders(orders.map(o => o.id === order.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder); // Update modal state immediately
            toast.success('¡Pedido confirmado correctamente!', { id: toastId });

        } catch (error: any) {
            console.error('CRITICAL ERROR confirming order:', error);
            toast.error(`Error al confirmar: ${error.message}`, { id: toastId });
        } finally {
            setProcessing(null);
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Eliminar Pedido',
            message: 'Esta acción es irreversible y eliminará el pedido junto con todos sus ítems. ¿Deseas continuar?',
            isDestructive: true,
            onConfirm: async () => await executeDeleteOrder(orderId)
        });
    };

    const executeDeleteOrder = async (orderId: string) => {
        closeModal();
        setProcessing(orderId);
        const toastId = toast.loading('Eliminando pedido...');

        try {
            // Manual Cascade Delete
            console.log('Deleting order items...');
            const { error: itemsError } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            console.log('Deleting order...');
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (orderError) throw orderError;

            setOrders(orders.filter(o => o.id !== orderId));
            setSelectedOrder(null); // Close the detail modal
            toast.success('Pedido eliminado permanentemente', { id: toastId });

        } catch (error: any) {
            console.error('CRITICAL ERROR deleting order:', error);
            toast.error(`Error al eliminar: ${error.message}`, { id: toastId });
        } finally {
            setProcessing(null);
        }
    };

    const getAddressString = (order: Order) => {
        if (order.shipping_address && typeof order.shipping_address === 'object' && 'formatted' in order.shipping_address) {
            return (order.shipping_address as any).formatted;
        }
        return order.shipping_address ? JSON.stringify(order.shipping_address) : 'Sin dirección';
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-secondary text-primary"><Loader2 className="animate-spin" size={48} /></div>;

    return (
        <div className="min-h-screen bg-secondary p-6">
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDestructive={modalConfig.isDestructive}
            />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-primary" />
                    Gestión de Pedidos
                </h1>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-surface hover:bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-white/40 text-xs">#{order.id.slice(0, 8)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {order.status === 'completed' ? 'Completado' : 'Pendiente'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{order.customer_name}</h3>
                            <div className="text-white/60 text-sm mb-4 flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                <div className="text-sm text-white/50">Total</div>
                                <div className="text-xl font-bold text-primary">${order.total_amount}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-surface rounded-xl border border-white/5">
                        <p className="text-white/40">No hay pedidos registrados.</p>
                    </div>
                )}

                {/* Order Detail Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#1a1a1a] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        Pedido #{selectedOrder.id.slice(0, 8)}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${selectedOrder.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {selectedOrder.status === 'completed' ? 'Completado' : 'Pendiente'}
                                        </span>
                                    </h2>
                                    <p className="text-white/50 text-sm mt-1">Realizado el {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                                {/* Customer Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                            <User size={14} /> Cliente
                                        </h3>
                                        <div className="bg-[#1e293b] p-5 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 space-y-3">
                                            <p className="text-white font-display font-bold text-lg">{selectedOrder.customer_name}</p>
                                            <div className="flex items-center gap-3 text-blue-300 text-sm">
                                                <Mail size={16} /> {selectedOrder.customer_email}
                                            </div>
                                            <div className="flex items-center gap-3 text-blue-300 text-sm">
                                                <Phone size={16} /> {selectedOrder.customer_phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                            <MapPin size={14} /> Envío
                                        </h3>
                                        <div className="bg-[#1e293b] p-5 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 h-full">
                                            <p className="text-white/80 leading-relaxed text-sm">
                                                {getAddressString(selectedOrder)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                        <ShoppingBag size={14} /> Productos
                                    </h3>
                                    <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 text-white/50">
                                                <tr>
                                                    <th className="p-3">Producto</th>
                                                    <th className="p-3 text-right">Cant</th>
                                                    <th className="p-3 text-right">Precio</th>
                                                    <th className="p-3 text-right">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-white/80">
                                                {selectedOrder.order_items?.map((item: any) => (
                                                    <tr key={item.id}>
                                                        <td className="p-3 font-medium">
                                                            <div className="flex items-center gap-3">
                                                                {item.product?.image && (
                                                                    <div className="size-8 rounded bg-white/5 overflow-hidden shrink-0">
                                                                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                )}
                                                                <span>{item.product?.name || 'Producto Desconocido'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-right">{item.quantity}</td>
                                                        <td className="p-3 text-right">${item.price}</td>
                                                        <td className="p-3 text-right text-white font-bold">${item.price * item.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-white/5 border-t border-white/10">
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-right font-bold text-white">Total</td>
                                                    <td className="p-4 text-right font-bold text-primary text-lg">${selectedOrder.total_amount}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 bg-surface flex justify-end gap-4 shrink-0">
                                {selectedOrder.status !== 'completed' && (
                                    <button
                                        onClick={() => handleConfirmOrder(selectedOrder)}
                                        disabled={!!processing}
                                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20 disabled:opacity-50"
                                    >
                                        <Check size={18} /> Confirmar Pedido
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                                    disabled={!!processing}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <Trash2 size={18} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
