"use client";

import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";
import CardFilme from "@/components/CardFilme";
import { useEffect, useState } from "react";
import { apiFetch } from "@/config/apiFetch";
import DetailsFilme from "@/components/DetailsFilme";

interface Filme {
    id: number;
    nome: string;
    poster: string;
    avaliacao?: number;
}

export default function MenuPage() {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalFilmeId, setModalFilmeId] = useState<number | null>(null);

    function handleAtualizarAvaliacaoFilme(idFilme: number, novaNota: number) {
        setFilmes((filmes) =>
            filmes.map((filme) =>
                filme.id === idFilme ? { ...filme, avaliacao: novaNota } : filme
            )
        );
    }

    useEffect(() => {
        async function fetchFilmesComAvaliacao() {
            setLoading(true);
            const res = await apiFetch("/filmes");
            const filmesData: Filme[] = await res.json();

            // Busca a média de avaliação para cada filme em paralelo
            const filmesComAvaliacao = await Promise.all(
                filmesData.map(async (filme) => {
                    try {
                        const resAvaliacao = await apiFetch(`/avaliacoes/media/filme/${filme.id}`);
                        const { mediaAvaliacao } = await resAvaliacao.json();
                        return { ...filme, avaliacao: mediaAvaliacao ?? undefined };
                    } catch {
                        return { ...filme, avaliacao: undefined };
                    }
                })
            );

            setFilmes(filmesComAvaliacao);
            setLoading(false);
        }

        fetchFilmesComAvaliacao();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                        Descubra e avalie filmes!
                    </h2>
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
                                    onDetalhes={() => setModalFilmeId(filme.id)}
                                    onAvaliacao={handleAtualizarAvaliacaoFilme} // <-- adicione esta linha
                                />
                            ))}
                        </div>
                    )}
                    {modalFilmeId && (
                        <DetailsFilme
                            id={modalFilmeId}
                            onClose={() => setModalFilmeId(null)}
                            onAvaliacaoEditada={handleAtualizarAvaliacaoFilme}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}