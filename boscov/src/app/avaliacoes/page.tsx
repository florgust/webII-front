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

interface Avaliacao {
    id: number;
    idFilme: number;
    nota: number;
    comentario: string;
    filme: Filme;
}

interface Usuario {
    id: number;
    nome: string;
    email: string;
    data_nascimento: string;
    apelido: string;
    tipo_usuario: string;
}

export default function AvaliacoesPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [filmesAvaliados, setFilmesAvaliados] = useState<Filme[]>([]);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalFilmeId, setModalFilmeId] = useState<number | null>(null);

    // Recupera o usuário do localStorage no client
    useEffect(() => {
        const usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal) {
            try {
                setUsuario(JSON.parse(usuarioLocal));
            } catch {
                setUsuario(null);
            }
        }
    }, []);

    // Função para recarregar avaliações do usuário
    async function recarregarAvaliacoesUsuario() {
        if (!usuario?.id) return;
        setLoading(true);
        try {
            const res = await apiFetch(`/avaliacoes/usuario/${usuario.id}`);
            const data = await res.json();
            setAvaliacoes(Array.isArray(data) ? data : []);
        } catch {
            setAvaliacoes([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        async function fetchAvaliacoesUsuario() {
            setLoading(true);
            if (!usuario?.id) {
                setAvaliacoes([]);
                setLoading(false);
                return;
            }
            try {
                const res = await apiFetch(`/avaliacoes/usuario/${usuario.id}`);
                const data = await res.json();
                setAvaliacoes(Array.isArray(data) ? data : []);
            } catch {
                setAvaliacoes([]);
            }
            setLoading(false);
        }
        if (usuario?.id) {
            fetchAvaliacoesUsuario();
        }
    }, [usuario]);

    useEffect(() => {
        // Apenas para debug
        // console.log("Avaliações salvas:", avaliacoes);
    }, [avaliacoes]);

    // Extrai os filmes avaliados pelo usuário (evita duplicidade)
    useEffect(() => {
        async function fetchFilmesDetalhes() {
            if (!avaliacoes.length) {
                setFilmesAvaliados([]);
                return;
            }
            const filmesDetalhes: Filme[] = [];
            for (const av of avaliacoes) {
                const res = await apiFetch(`/filme/${av.idFilme}`);
                const filme = await res.json();
                filmesDetalhes.push({
                    id: filme.id,
                    nome: filme.nome,
                    poster: filme.poster,
                    avaliacao: av.nota,
                });
            }
            setFilmesAvaliados(filmesDetalhes);
        }
        fetchFilmesDetalhes();
    }, [avaliacoes]);

    let conteudoPrincipal;
    if (loading) {
        conteudoPrincipal = (
            <div className="text-gray-400">Carregando avaliações...</div>
        );
    } else if (filmesAvaliados.length === 0) {
        conteudoPrincipal = (
            <div className="text-gray-400 text-center">Você ainda não avaliou nenhum filme.</div>
        );
    } else {
        conteudoPrincipal = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filmesAvaliados.map((filme, index) => (
                    <CardFilme
                        key={filme.id + '-' + index}
                        id={filme.id}
                        nome={filme.nome}
                        poster={filme.poster}
                        avaliacao={filme.avaliacao}
                        onDetalhes={() => setModalFilmeId(filme.id)}
                    />
                ))}
            </div>
        );
    }

    function handleAtualizarAvaliacaoFilme(idFilme: number, novaNota: number) {
        setFilmesAvaliados((filmes) =>
            filmes.map((filme) =>
                filme.id === idFilme ? { ...filme, avaliacao: novaNota } : filme
            )
        );
    }


    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                        Minhas Avaliações
                    </h2>
                    {conteudoPrincipal}
                    {modalFilmeId && usuario?.id && (
                        <DetailsFilme
                            id={modalFilmeId}
                            onClose={() => {
                                setModalFilmeId(null);
                                recarregarAvaliacoesUsuario();
                            }}
                            idUsuarioFiltrar={usuario.id}
                            onAvaliacaoEditada={handleAtualizarAvaliacaoFilme}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}