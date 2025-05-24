"use client";

import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";
import { useEffect, useState } from "react";
import { apiFetch } from "@/config/apiFetch";
import DetailsFilme from "@/components/DetailsFilme";
import Image from "next/image";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Tipos
interface Avaliacao {
    id: number;
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

interface Filme {
    id: number;
    nome: string;
    poster: string;
}

// Renderização das estrelas
function renderStars(nota: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (nota >= i) {
            stars.push(<FaStar key={i} className="text-yellow-400" />);
        } else if (nota >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } else {
            stars.push(<FaRegStar key={i} className="text-yellow-400" />);
        }
    }
    return stars;
}

// Card da avaliação
function CardAvaliacao({
    avaliacao,
    filme,
    onDetalhes,
}: Readonly<{
    avaliacao: Avaliacao;
    filme: Filme | null;
    onDetalhes: () => void;
}>) {
    return (
        <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 flex flex-col items-center p-4 w-full max-w-xs mx-auto h-full">
            <div className="w-full h-64 relative mb-4">
                {filme?.poster ? (
                    <Image
                        src={filme.poster}
                        alt={filme.nome}
                        fill
                        className="object-cover rounded-lg border border-neutral-800"
                        sizes="(max-width: 768px) 100vw, 320px"
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-lg border border-neutral-800 text-gray-400">
                        Sem imagem
                    </div>
                )}
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2 text-center line-clamp-2">
                {filme?.nome ?? "Filme"}
            </h2>
            <div className="flex items-center gap-1 mb-2">
                {renderStars(avaliacao.nota)}
                <span className="text-gray-400 font-semibold ml-2">{avaliacao.nota.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">/ 5</span>
            </div>
            {avaliacao.comentario && (
                <div className="text-gray-300 text-sm mb-2 text-center line-clamp-3">
                    "{avaliacao.comentario}"
                </div>
            )}
            <button
                type="button"
                onClick={onDetalhes}
                className="w-full mt-auto px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800 text-gray-200 font-medium transition text-base"
            >
                Ver detalhes
            </button>
        </div>
    );
}

export default function AvaliacoesPage() {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [filmes, setFilmes] = useState<Record<number, Filme>>({});
    const [loading, setLoading] = useState(true);
    const [modalFilmeId, setModalFilmeId] = useState<number | null>(null);

    // Recupera usuário do localStorage
    let idUsuario: number | null = null;
    if (typeof window !== "undefined") {
        const usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal) {
            try {
                idUsuario = JSON.parse(usuarioLocal).id;
            } catch {}
        }
    }

    useEffect(() => {
        async function fetchAvaliacoes() {
            if (!idUsuario) return;
            setLoading(true);
            // Busca avaliações do usuário
            const res = await apiFetch(`/avaliacoes/usuario/${idUsuario}`);
            const avaliacoesData: Avaliacao[] = await res.json();

            // Busca dados dos filmes avaliados
            const filmesIds = Array.from(new Set(avaliacoesData.map(a => a.idFilme)));
            const filmesMap: Record<number, Filme> = {};
            await Promise.all(
                filmesIds.map(async (id) => {
                    try {
                        const resFilme = await apiFetch(`/filme/${id}`);
                        const filmeData = await resFilme.json();
                        filmesMap[id] = {
                            id: filmeData.id,
                            nome: filmeData.nome,
                            poster: filmeData.poster,
                        };
                    } catch {}
                })
            );

            setAvaliacoes(avaliacoesData);
            setFilmes(filmesMap);
            setLoading(false);
        }
        fetchAvaliacoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idUsuario]);

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                        Minhas Avaliações
                    </h2>
                    {loading ? (
                        <div className="text-gray-400">Carregando avaliações...</div>
                    ) : avaliacoes.length === 0 ? (
                        <div className="text-gray-400 text-center mt-16">
                            Você ainda não avaliou nenhum filme.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {avaliacoes.map(avaliacao => (
                                <CardAvaliacao
                                    key={avaliacao.id}
                                    avaliacao={avaliacao}
                                    filme={filmes[avaliacao.idFilme] || null}
                                    onDetalhes={() => setModalFilmeId(avaliacao.idFilme)}
                                />
                            ))}
                        </div>
                    )}
                    {modalFilmeId && (
                        <DetailsFilme id={modalFilmeId} onClose={() => setModalFilmeId(null)} />
                    )}
                </main>
            </div>
        </div>
    );
}