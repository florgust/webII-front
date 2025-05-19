"use client";

import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";
import CardFilme from "@/components/CardFilme";
import { useEffect, useState } from "react";
import { apiFetch } from "@/config/apiFetch";

interface Filme {
    id: number;
    nome: string;
    poster: string;
    avaliacao?: number;
}

export default function MenuPage() {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/filmes")
            .then(res => res.json())
            .then(data => setFilmes(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                        Descubra e avalie filmes!
                    </h1>
                    {loading ? (
                        <div className="text-gray-400">Carregando filmes...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filmes.map(filme => (
                                <CardFilme
                                    key={filme.id}
                                    id={filme.id}
                                    nome={filme.nome}
                                    poster={filme.poster}
                                    avaliacao={filme.avaliacao}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}