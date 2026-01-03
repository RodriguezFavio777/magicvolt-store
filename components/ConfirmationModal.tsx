import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDestructive = false,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-secondary border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold font-display">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-white/70 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                            ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                                : 'bg-primary hover:bg-white text-secondary shadow-primary/20'
                            }
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
