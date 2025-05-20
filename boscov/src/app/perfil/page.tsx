"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";
import Modal from "@/components/SucessoOuErro";
import { apiFetch } from "@/config/apiFetch";


interface Usuario {
    id: number;
    nome: string;
    email: string;
    data_nascimento: string;
    apelido: string;
    tipo_usuario: string;
}

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ nome: "", email: "", data_nascimento: "", apelido: "" });
    const [modal, setModal] = useState<{ open: boolean; type: "success" | "error"; message: string }>({ open: false, type: "success", message: "" });

    useEffect(() => {
        const usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal) {
            const user = JSON.parse(usuarioLocal);
            setUsuario(user);
            setForm({
                nome: user.nome || "",
                email: user.email || "",
                data_nascimento: user.data_nascimento ? user.data_nascimento.slice(0, 10) : "",
                apelido: user.apelido || "",
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch(`/usuario/${usuario?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem("usuario", JSON.stringify(updatedUser));
                setUsuario(updatedUser);
                setModal({ open: true, type: "success", message: "Perfil atualizado com sucesso!" });
                setModalOpen(false);
            } else {
                setModal({ open: true, type: "error", message: "Erro ao atualizar perfil." });
            }
        } catch {
            setModal({ open: true, type: "error", message: "Erro ao atualizar perfil." });
        }
        setTimeout(() => setModal({ ...modal, open: false }), 2000);
    };

    if (!usuario) {
        return (
            <div className="flex flex-col min-h-screen">
                <HeaderMenu showSearch={false} />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <span className="text-gray-400">Carregando perfil...</span>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu showSearch={false} />
            <Modal open={modal.open} type={modal.type} message={modal.message} />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center">
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">Meu Perfil</h2>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Nome</label>
                            <div className="bg-neutral-900 text-gray-100 rounded px-3 py-2">{usuario.nome}</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Apelido</label>
                            <div className="bg-neutral-900 text-gray-100 rounded px-3 py-2">{usuario.apelido}</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                            <div className="bg-neutral-900 text-gray-100 rounded px-3 py-2">{usuario.email}</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Data de Nascimento</label>
                            <div className="bg-neutral-900 text-gray-100 rounded px-3 py-2">
                                {usuario.data_nascimento ? new Date(usuario.data_nascimento).toLocaleDateString() : ""}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-400 text-sm mb-1">Tipo de Usuário</label>
                            <div className="bg-neutral-900 text-gray-100 rounded px-3 py-2 capitalize">{usuario.tipo_usuario}</div>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full py-2 rounded bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition"
                        >
                            Editar Perfil
                        </button>
                    </div>

                    {/* Modal de edição */}
                    {modalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-4 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-200 text-xl"
                                    aria-label="Fechar"
                                >
                                    ×
                                </button>
                                <h3 className="text-2xl font-bold text-gray-100 mb-2 text-center">Editar Perfil</h3>
                                <div>
                                    <label htmlFor="nome" className="block text-gray-300 mb-1">Nome</label>
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        value={form.nome}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="apelido" className="block text-gray-300 mb-1">Apelido</label>
                                    <input
                                        id="apelido"
                                        name="apelido"
                                        type="text"
                                        value={form.apelido}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="data_nascimento" className="block text-gray-300 mb-1">Data de Nascimento</label>
                                    <input
                                        id="data_nascimento"
                                        name="data_nascimento"
                                        type="date"
                                        value={form.data_nascimento}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 mt-2 rounded bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition"
                                >
                                    Salvar Alterações
                                </button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}