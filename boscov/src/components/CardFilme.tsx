import Link from "next/link";
import Image from "next/image";
import { FiEye, FiEdit } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


interface CardFilmeProps {
    id: number;
    nome: string;
    poster: string;
    avaliacao?: number;
    onDetalhes?: () => void;
}

function renderStars(avaliacao?: number) {
    const stars = [];
    const nota = avaliacao ?? 0;
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

export default function CardFilme({ id, nome, poster, avaliacao, onDetalhes }: Readonly<CardFilmeProps>) {
    return (
        <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 flex flex-col items-center p-4 transition hover:scale-[1.02] hover:border-gray-600 w-full max-w-xs mx-auto h-full">
            <div className="w-full h-64 relative mb-4">
                <Image
                    src={poster}
                    alt={nome}
                    fill
                    className="object-cover rounded-lg border border-neutral-800"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority={false}
                />
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2 text-center line-clamp-2">{nome}</h2>
            <div className="flex items-center gap-1 mb-4">
                {renderStars(avaliacao)}
                <span className="text-gray-400 font-semibold ml-2">
                    {avaliacao !== undefined ? avaliacao.toFixed(1) : "--"}
                </span>
                <span className="text-gray-400 text-sm">/ 5</span>
            </div>
            <div className="flex gap-2 w-full mt-auto">
                <Link
                    href={`/filmes/${id}/avaliar`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-2 sm:py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-gray-200 font-medium transition text-base sm:text-sm"
                >
                    <FiEdit />
                    Avaliar
                </Link>
                <Link
                    href="#"
                    onClick={e => { e.preventDefault(); onDetalhes?.(); }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-2 sm:py-1 rounded border border-neutral-700 hover:bg-neutral-800 text-gray-200 font-medium transition text-base sm:text-sm"
                >
                    <FiEye />
                    Detalhes
                </Link>
            </div>
        </div>
    );
}