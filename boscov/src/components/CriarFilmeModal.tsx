import { useEffect, useState } from "react";
import { apiFetch } from "@/config/apiFetch";

interface CriarFilmeModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CLASSIFICACOES = ["Livre", "12+", "14+", "16+", "18+"] as const;

export default function CriarFilmeModal({ open, onClose, onSuccess }: Readonly<CriarFilmeModalProps>) {
    const [form, setForm] = useState({
        nome: "",
        diretor: "",
        anoLancamento: "",
        duracao: "",
        produtora: "",
        classificacao: CLASSIFICACOES[0],
        poster: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Gêneros
    const [generos, setGeneros] = useState<{ id: number; descricao: string }[]>([]);
    const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([]);

    useEffect(() => {
        if (!open) return;
        async function fetchGeneros() {
            try {
                const res = await apiFetch("/generos");
                const data = await res.json();
                setGeneros(data);
            } catch {
                setGeneros([]);
            }
        }
        fetchGeneros();
    }, [open]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeneroChange = (id: number, checked: boolean) => {
        if (checked) {
            setGenerosSelecionados([...generosSelecionados, id]);
        } else {
            setGenerosSelecionados(generosSelecionados.filter(gid => gid !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const res = await apiFetch("/filme", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: form.nome,
                    diretor: form.diretor,
                    anoLancamento: Number(form.anoLancamento),
                    duracao: Number(form.duracao),
                    produtora: form.produtora,
                    classificacao: form.classificacao,
                    poster: form.poster,
                }),
            });

            if (!res.ok) {
                throw new Error("Erro ao criar filme");
            }

            const filmeCriado = await res.json();

            // Associar gêneros selecionados ao filme
            for (const idGenero of generosSelecionados) {
                await apiFetch("/genero_filme", {
                    method: "POST",
                    headers: {
                        idgenero: idGenero.toString(),
                        idfilme: filmeCriado.id.toString(),
                        "Authorization": `Bearer ${token}`
                    },
                });
            }

            setForm({
                nome: "",
                diretor: "",
                anoLancamento: "",
                duracao: "",
                produtora: "",
                classificacao: CLASSIFICACOES[0],
                poster: "",
            });
            setGenerosSelecionados([]);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro desconhecido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-neutral-900 rounded-lg p-8 w-full max-w-md shadow-lg border border-neutral-700">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Criar novo filme</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name="nome"
                        placeholder="Nome do filme"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.nome}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="diretor"
                        placeholder="Diretor"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.diretor}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="anoLancamento"
                        placeholder="Ano de lançamento"
                        type="number"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.anoLancamento}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="duracao"
                        placeholder="Duração (minutos)"
                        type="number"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.duracao}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="produtora"
                        placeholder="Produtora"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.produtora}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="classificacao"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.classificacao}
                        onChange={handleChange}
                        required
                    >
                        {CLASSIFICACOES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <input
                        name="poster"
                        placeholder="URL do poster"
                        className="bg-neutral-800 text-gray-200 rounded px-3 py-2 outline-none"
                        value={form.poster}
                        onChange={handleChange}
                        required
                    />

                    {/* Seleção de gêneros */}
                    <div>
                        <label className="block text-gray-300 mb-1">Gêneros</label>
                        <div className="flex flex-wrap gap-2">
                            {generos.map((g) => (
                                <label key={g.id} className="flex items-center gap-1 text-gray-200">
                                    <input
                                        type="checkbox"
                                        value={g.id}
                                        checked={generosSelecionados.includes(g.id)}
                                        onChange={e => handleGeneroChange(g.id, e.target.checked)}
                                    />
                                    {g.descricao}
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-neutral-700 text-gray-200 hover:bg-neutral-800 transition"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Criar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}