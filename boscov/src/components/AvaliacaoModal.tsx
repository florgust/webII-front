import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { apiFetch } from "@/config/apiFetch";

interface AvaliacaoModalProps {
    open: boolean;
    onClose: () => void;
    idFilme: number;
    idUsuario: number;
    onSuccess?: () => void;
}

export default function AvaliacaoModal({ open, onClose, idFilme, idUsuario, onSuccess }: Readonly<AvaliacaoModalProps>) {
    const [nota, setNota] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        setLoading(true);
        try {
            const res = await apiFetch("/avaliacao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    idusuario: String(idUsuario),
                    idfilme: String(idFilme),
                },
                body: JSON.stringify({
                    nota,
                    comentario,
                }),
            });
            if (res.ok) {
                setSucesso(true);
                onSuccess?.();
                setTimeout(() => {
                    setSucesso(false);
                    onClose();
                }, 1200);
            } else {
                let msg = "Erro ao enviar avaliação.";
                try {
                    const data = await res.json();
                    if (data && data.message) msg = data.message;
                } catch { }
                setErro(msg);
            }
        } catch {
            setErro("Erro ao enviar avaliação.");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form
                onSubmit={handleSubmit}
                className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center gap-6 border border-neutral-700"
            >
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Avaliar Filme</h2>
                <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setNota(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
                            className="focus:outline-none"
                        >
                            <FaStar
                                size={32}
                                className={
                                    (hover || nota) >= star
                                        ? "text-yellow-400 drop-shadow"
                                        : "text-gray-600"
                                }
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    className="w-full rounded bg-neutral-800 text-gray-100 p-3 resize-none border border-neutral-700 focus:border-blue-500 outline-none"
                    rows={4}
                    placeholder="Escreva um comentário (opcional)"
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    maxLength={500}
                />
                {erro && <div className="text-red-400 text-sm">{erro}</div>}
                {sucesso && <div className="text-green-400 text-sm">Avaliação enviada!</div>}
                <div className="flex gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 rounded bg-neutral-700 text-gray-200 hover:bg-neutral-800 transition"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        disabled={loading || nota === 0}
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                </div>
            </form>
        </div>
    );
}