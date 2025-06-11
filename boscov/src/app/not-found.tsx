"use client";

import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex flex-col items-center shadow-lg max-w-md w-full">
                <span className="text-6xl mb-6">🧭</span>
                <h1 className="text-3xl font-bold text-gray-100 mb-4 text-center">
                    404 - Página não encontrada
                </h1>
                <div className="mb-6 text-gray-300 text-center flex flex-col gap-2">
                    <span>
                        Parece que você está tão <span className="font-bold text-white">perdido</span> quanto os personagens de <span className="font-bold text-white">Lost</span>!
                    </span>
                    <span>
                        Essa página não existe ou foi movida para uma ilha misteriosa.
                    </span>
                </div>
                <Link
                    href="/menu"
                    className="px-6 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition font-semibold text-center"
                >
                    Voltar para o Menu
                </Link>
            </div>
        </div>
    );
}