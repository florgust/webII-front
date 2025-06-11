import Image from "next/image";

interface CardFilmeDesativadoProps {
    id: number;
    nome: string;
    poster: string;
    onReativar: (id: number) => void;
    reativando: boolean;
}

export default function CardFilmeDesativado({
    id,
    nome,
    poster,
    onReativar,
    reativando,
}: Readonly<CardFilmeDesativadoProps>) {
    return (
        <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 flex flex-col items-center p-4 w-full max-w-xs mx-auto h-full">
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
            <h2 className="text-lg font-bold text-gray-100 mb-4 text-center line-clamp-2">{nome}</h2>
            <button
                className="w-full px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition"
                onClick={() => onReativar(id)}
                disabled={reativando}
            >
                {reativando ? "Reativando..." : "Reativar"}
            </button>
        </div>
    );
}