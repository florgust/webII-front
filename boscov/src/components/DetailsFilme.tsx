import { useEffect, useState } from "react";
import Image from "next/image";
import { FiX, FiStar } from "react-icons/fi";
import { apiFetch } from "@/config/apiFetch";
import ComentariosFilme from "./ComentariosFilmes";
import ModalEditarAvaliacao from "./EditarAvaliacaoModal";

interface DetailsFilmeProps {
    id: number;
    onClose: () => void;
    idUsuarioFiltrar?: number;
    onAvaliacaoEditada?: (idFilme: number, novaNota: number) => void;
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
    usuario: { id: number; nome: string };
}

export default function DetailsFilme({
    id,
    onClose,
    idUsuarioFiltrar,
    onAvaliacaoEditada,
}: Readonly<DetailsFilmeProps>) {
    const [filme, setFilme] = useState<FilmeDetalhes | null>(null);
    const [loading, setLoading] = useState(true);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loadingComentarios, setLoadingComentarios] = useState(true);
    const [notaUsuario, setNotaUsuario] = useState<number | undefined>(undefined);
    const [mediaAvaliacao, setMediaAvaliacao] = useState<number | undefined>(undefined);

    // Novo estado para os gêneros
    const [generos, setGeneros] = useState<string[]>([]);

    // Controle do modal de edição
    const [modalEditar, setModalEditar] = useState(false);
    const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState<{ id: number; comentario: string; nota: number } | null>(null);

    useEffect(() => {
        async function fetchFilme() {
            setLoading(true);
            const res = await apiFetch(`/filme/${id}`);
            const data = await res.json();
            setFilme({ ...data });
            setLoading(false);
        }
        fetchFilme();
    }, [id]);

    // Buscar gêneros do filme
    useEffect(() => {
        async function fetchGeneros() {
            try {
                const res = await apiFetch(`/genero_filme/generos/${id}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setGeneros(data.map((g: { descricao: string }) => g.descricao));
                } else {
                    setGeneros([]);
                }
            } catch {
                setGeneros([]);
            }
        }
        fetchGeneros();
    }, [id]);

    // Função para recarregar avaliações (pode ser usada após editar)
    async function recarregarAvaliacoes() {
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

    useEffect(() => {
        recarregarAvaliacoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Busca a nota do usuário logado (filtra do array de avaliações)
    useEffect(() => {
        if (typeof idUsuarioFiltrar === "number") {
            const avaliacaoUsuario = avaliacoes.find(
                (av) => av.idUsuario === idUsuarioFiltrar
            );
            setNotaUsuario(avaliacaoUsuario ? avaliacaoUsuario.nota : undefined);
        } else {
            setNotaUsuario(undefined);
        }
    }, [avaliacoes, idUsuarioFiltrar]);

    // Calcula a média geral das avaliações
    useEffect(() => {
        if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce((acc, av) => acc + av.nota, 0);
            setMediaAvaliacao(soma / avaliacoes.length);
        } else {
            setMediaAvaliacao(undefined);
        }
    }, [avaliacoes]);

    // Função para abrir modal de edição
    function handleEditarAvaliacao(avaliacao: { id: number; comentario: string; nota: number }) {
        setAvaliacaoParaEditar(avaliacao);
        setModalEditar(true);
    }

    function handleFecharModalEditar() {
        setModalEditar(false);
        setAvaliacaoParaEditar(null);
    }

    let notaExibida: string;
    if (typeof idUsuarioFiltrar === "number") {
        notaExibida = typeof notaUsuario === "number" ? notaUsuario.toFixed(1) : "--";
    } else {
        notaExibida = typeof mediaAvaliacao === "number" ? mediaAvaliacao.toFixed(1) : "--";
    }

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
                            <div className="mb-2">
                                <span className="font-semibold text-gray-400">Gêneros: </span>
                                <span className="text-gray-200">
                                    {generos.length > 0 ? generos.join(", ") : "Sem gênero"}
                                </span>
                            </div>
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
                                {notaExibida} / 5
                            </span>
                            <span className="text-gray-400 text-sm ml-2">
                                {typeof idUsuarioFiltrar === "number" ? "(Sua avaliação)" : "(Média geral)"}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Comentários ocupando toda a largura do modal */}
                {typeof idUsuarioFiltrar === "number" ? (
                    <>
                        <ComentariosFilme
                            avaliacoes={avaliacoes}
                            loading={loadingComentarios}
                            idUsuarioFiltrar={idUsuarioFiltrar}
                            onEditarAvaliacao={handleEditarAvaliacao}
                            onDeletarAvaliacao={() => recarregarAvaliacoes()}
                        />
                        {modalEditar && avaliacaoParaEditar && (
                            <ModalEditarAvaliacao
                                avaliacao={avaliacaoParaEditar}
                                onClose={handleFecharModalEditar}
                                onSuccess={(novaNota) => {
                                    recarregarAvaliacoes();
                                    handleFecharModalEditar();
                                    if (onAvaliacaoEditada) {
                                        onAvaliacaoEditada(id, novaNota);
                                    }
                                }}
                            />
                        )}
                    </>
                ) : (
                    <ComentariosFilme
                        avaliacoes={avaliacoes}
                        loading={loadingComentarios}
                    />
                )}
            </div>
        </div>
    );
}