import React from "react";

interface LogoutModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LogoutModal({ open, onClose }: Readonly<LogoutModalProps>) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="p-6 rounded bg-neutral-800 text-center shadow-lg border border-blue-500">
                <p className="text-lg text-blue-400 mb-4">Você foi desconectado!</p>
                <button
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={onClose}
                >
                    Voltar para o início
                </button>
            </div>
        </div>
    );
}