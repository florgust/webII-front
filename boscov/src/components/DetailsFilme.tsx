import { useEffect, useState } from "react";
import Image from "next/image";
import { FiX, FiStar } from "react-icons/fi";
import { apiFetch } from "@/config/apiFetch";
import ComentariosFilme from "./ComentariosFilmes";

interface DetailsFilmeProps {
    id: number;
    onClose: () => void;
}

interface FilmeDetalhes {
    id: number;
    nome: string;
    descricao?: string;
    diretor: string;
    anoLancamento: number;
    duracao: number;
    produtora: string;
    classificacao: string;
    poster: string;
    generos?: string[];
    avaliacao?: number;
}

interface Avaliacao {
    id: number;
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    usuario: { nome: string };
}

export default function DetailsFilme({ id, onClose }: Readonly<DetailsFilmeProps>) {
    const [filme, setFilme] = useState<FilmeDetalhes | null>(null);
    const [loading, setLoading] = useState(true);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loadingComentarios, setLoadingComentarios] = useState(true);

    useEffect(() => {
        async function fetchFilme() {
            setLoading(true);
            const res = await apiFetch(`/filme/${id}`);
            const data = await res.json();
            let avaliacao = undefined;
            try {
                const resAvaliacao = await apiFetch(`/avaliacoes/media/filme/${id}`);
                const { mediaAvaliacao } = await resAvaliacao.json();
                avaliacao = mediaAvaliacao ?? undefined;
            } catch { }
            setFilme({ ...data, avaliacao });
            setLoading(false);
        }
        fetchFilme();
    }, [id]);

    useEffect(() => {
        async function fetchAvaliacoes() {
            setLoadingComentarios(true);
            let avaliacoesData: Avaliacao[] = [];
            try {
                const res = await apiFetch(`/avaliacoes/filme/${id}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    avaliacoesData = data;
                }
            } catch {
                avaliacoesData = [];
            }
            setAvaliacoes(avaliacoesData);
            setLoadingComentarios(false);
        }
        fetchAvaliacoes();
    }, [id]);

    if (!filme && loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-neutral-900 rounded-xl p-8 text-gray-100 min-w-[320px]">
                    Carregando detalhes...
                </div>
            </div>
        );
    }

    if (!filme) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto">
            <div className="relative bg-neutral-900 rounded-xl shadow-xl border border-neutral-800 w-full max-w-2xl mx-4 p-6 flex flex-col gap-6">
                {/* Botão fechar */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <FiX />
                </button>
                {/* Detalhes principais: imagem + infos */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagem */}
                    <div className="flex-shrink-0 w-full md:w-56 h-80 relative mx-auto md:mx-0">
                        {filme.poster ? (
                            <Image
                                src={filme.poster}
                                alt={filme.nome || "Poster do filme"}
                                fill
                                className="object-cover rounded-lg border border-neutral-800"
                                sizes="(max-width: 768px) 100vw, 224px"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-lg border border-neutral-800 text-gray-400">
                                Sem imagem
                            </div>
                        )}
                    </div>
                    {/* Detalhes */}
                    <div className="flex-1 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 text-gray-100">{filme.nome}</h2>
                            {filme.descricao && (
                                <p className="text-gray-300 mb-3 text-sm">{filme.descricao}</p>
                            )}
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Diretor: </span>
                                <span className="text-gray-200">{filme.diretor}</span>
                            </div>
                            {filme.generos && (
                                <div className="mb-2">
                                    <span className="font-semibold text-gray-400">Gêneros: </span>
                                    <span className="text-gray-200">{filme.generos.join(", ")}</span>
                                </div>
                            )}
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Ano: </span>
                                <span className="text-gray-200">{filme.anoLancamento}</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Duração: </span>
                                <span className="text-gray-200">{filme.duracao} min</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Produtora: </span>
                                <span className="text-gray-200">{filme.produtora}</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Classificação: </span>
                                <span className="text-gray-200">{filme.classificacao}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-6">
                            <FiStar className="text-yellow-400" />
                            <span className="text-gray-200 font-semibold">
                                {filme.avaliacao !== undefined ? filme.avaliacao.toFixed(1) : "--"} / 5
                            </span>
                        </div>
                    </div>
                </div>
                {/* Comentários ocupando toda a largura do modal */}
                <ComentariosFilme avaliacoes={avaliacoes} loading={loadingComentarios} />
            </div>
        </div>
    );
}