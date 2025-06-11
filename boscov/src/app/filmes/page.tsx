"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";
import { apiFetch } from "@/config/apiFetch";
import CardFilmeDesativado from "@/components/CardFilmeDesativado";

interface Filme {
    id: number;
    nome: string;
    poster: string;
    avaliacao?: number;
    status?: number;
}

export default function FilmesDesativadosPage() {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [loading, setLoading] = useState(true);
    const [reativandoId, setReativandoId] = useState<number | null>(null);

    async function fetchFilmesDesativados() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch("/desativados/filmes", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setFilmes(Array.isArray(data) ? data : []);
        } catch {
            setFilmes([]);
        }
        setLoading(false);
    }

    async function handleReativarFilme(id: number) {
        setReativandoId(id);
        try {
            const token = localStorage.getItem("token");
            await apiFetch(`/filme/${id}/delete`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFilmes(filmes => filmes.filter(f => f.id !== id));
        } catch {
            alert("Erro ao reativar filme.");
        }
        setReativandoId(null);
    }

    useEffect(() => {
        fetchFilmesDesativados();
    }, []);

    let conteudoFilmes;
    if (loading) {
        conteudoFilmes = (
            <div className="text-gray-400 text-center">Carregando filmes desativados...</div>
        );
    } else if (filmes.length === 0) {
        conteudoFilmes = (
            <div className="text-gray-400 text-center">Nenhum filme desativado encontrado.</div>
        );
    } else {
        conteudoFilmes = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filmes.map(filme => (
                    <CardFilmeDesativado
                        key={filme.id}
                        id={filme.id}
                        nome={filme.nome}
                        poster={filme.poster}
                        onReativar={handleReativarFilme}
                        reativando={reativandoId === filme.id}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                        Filmes Desativados
                    </h2>
                    {conteudoFilmes}
                </main>
            </div>
        </div>
    );
}