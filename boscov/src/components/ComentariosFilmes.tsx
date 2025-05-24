import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ComentariosFilmeProps {
    avaliacoes: {
        id: number;
        comentario: string;
        usuario: { nome: string };
        nota: number; // Adicione a nota aqui
    }[];
    loading: boolean;
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

export default function ComentariosFilme({ avaliacoes, loading }: Readonly<ComentariosFilmeProps>) {
    if (loading) {
        return <div className="text-gray-400">Carregando comentários...</div>;
    }
    if (!avaliacoes.length) return null;

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-100 mb-2">Comentários</h3>
            <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2 w-full">
                {avaliacoes.map((avaliacao) => (
                    <div
                        key={avaliacao.id}
                        className="flex flex-col bg-neutral-800 rounded-lg p-3 w-full"
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-neutral-900 flex items-center justify-center text-lg font-bold text-gray-200">
                                {avaliacao.usuario.nome[0]?.toUpperCase() ?? "U"}
                            </div>
                            <div className="font-semibold text-gray-200">{avaliacao.usuario.nome}</div>
                            <div className="flex items-center ml-auto">
                                {renderStars(avaliacao.nota)}
                            </div>
                        </div>
                        <div className="text-gray-300 break-words w-full">{avaliacao.comentario}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}