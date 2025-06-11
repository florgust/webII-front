"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col items-center shadow-lg max-w-md w-full">
                <span className="text-6xl mb-4">🔒</span>
                <h1 className="text-3xl font-bold text-gray-100 mb-2">401 - Não autenticado</h1>
                <p className="text-gray-300 mb-6 text-center">
                    Você precisa estar autenticado para acessar esta área.<br />
                    Faça login para continuar.
                </p>
                <div className="flex gap-4 w-full">
                    <Link
                        href="/login"
                        className="flex-1 px-6 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition font-semibold text-center"
                    >
                        Ir para o Login
                    </Link>
                    <Link
                        href="/inicial"
                        className="flex-1 px-6 py-2 rounded bg-neutral-800 text-gray-200 hover:bg-neutral-700 transition font-semibold text-center"
                    >
                        Voltar para Inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}