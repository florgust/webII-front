import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ComentariosFilmeProps {
    avaliacoes: {
        id: number;
        comentario: string;
        usuario: { id: number, nome: string };
        nota: number;
    }[];
    loading: boolean;
    idUsuarioFiltrar?: number;
    onEditarAvaliacao?: (avaliacao: { id: number; comentario: string; nota: number }) => void;
}

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

export default function ComentariosFilme({ avaliacoes, loading, idUsuarioFiltrar, onEditarAvaliacao }: Readonly<ComentariosFilmeProps>) {
    const avaliacoesFiltradas = idUsuarioFiltrar
        ? avaliacoes.filter(av => av.usuario.id === idUsuarioFiltrar)
        : avaliacoes;

    if (loading) {
        return <div className="text-gray-400">Carregando comentários...</div>;
    }
    if (!avaliacoes.length) return null;

    return (
        <div className="space-y-4">
            {avaliacoesFiltradas.map(avaliacao => (
                <div key={avaliacao.id} className="bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-200">{avaliacao.usuario.nome}</span>
                        <span className="flex items-center gap-1 ml-auto">
                            {renderStars(avaliacao.nota)}
                        </span>
                        {idUsuarioFiltrar && onEditarAvaliacao && (
                            <button
                                className="ml-2 text-gray-400 hover:text-blue-400 cursor-pointer"
                                title="Editar avaliação"
                                onClick={() => onEditarAvaliacao(avaliacao)}
                            >
                                ✏️
                            </button>
                        )}
                    </div>
                    <div className="text-gray-300">{avaliacao.comentario}</div>
                </div>
            ))}
        </div>
    );
}