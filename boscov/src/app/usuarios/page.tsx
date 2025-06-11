"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/config/apiFetch";
import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    data_nascimento: string;
    status: number;
    apelido: string;
    tipo_usuario: string;
}

function formatarData(data: string) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
}

function StatusBadge({ status }: Readonly<{ status: number }>) {
    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 1 ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
            {status === 1 ? "Ativo" : "Desativado"}
        </span>
    );
}

function UsuarioCard({ usuario, onDesativar, onAtivar, desativando, ativando }: Readonly<{
    usuario: Usuario;
    onDesativar: (id: number) => void;
    onAtivar: (id: number) => void;
    desativando: boolean;
    ativando: boolean;
}>) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col gap-2 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <div className="text-lg font-bold text-gray-100">{usuario.nome}</div>
                    <div className="text-gray-400 text-sm">{usuario.email}</div>
                </div>
                <StatusBadge status={usuario.status} />
            </div>
            <div className="flex flex-col gap-1 mt-2 text-gray-300 text-sm">
                <div>
                    <span className="font-semibold text-gray-400">Apelido:</span> {usuario.apelido}
                </div>
                <div>
                    <span className="font-semibold text-gray-400">Nascimento:</span> {formatarData(usuario.data_nascimento)}
                </div>
                <div>
                    <span className="font-semibold text-gray-400">Tipo:</span> {usuario.tipo_usuario}
                </div>
            </div>
            <div className="flex justify-end mt-3">
                {usuario.status === 1 ? (
                    <button
                        className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition"
                        onClick={() => onDesativar(usuario.id)}
                        disabled={desativando}
                    >
                        {desativando ? "Desativando..." : "Desativar"}
                    </button>
                ) : (
                    <button
                        className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition"
                        onClick={() => onAtivar(usuario.id)}
                        disabled={ativando}
                    >
                        {ativando ? "Ativando..." : "Ativar"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [desativandoId, setDesativandoId] = useState<number | null>(null);
    const [ativandoId, setAtivandoId] = useState<number | null>(null);

    async function fetchUsuarios() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch("/usuarios", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch {
            setUsuarios([]);
        }
        setLoading(false);
    }

    async function handleDesativarUsuario(id: number) {
        setDesativandoId(id);
        try {
            const token = localStorage.getItem("token");
            await apiFetch(`/usuario/${id}/delete`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(usuarios =>
                usuarios.map(u =>
                    u.id === id ? { ...u, status: 0 } : u
                )
            );
        } catch {
            alert("Erro ao desativar usuário.");
        }
        setDesativandoId(null);
    }

    async function handleAtivarUsuario(id: number) {
        setAtivandoId(id);
        try {
            const token = localStorage.getItem("token");
            await apiFetch(`/usuario/${id}/delete`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(usuarios =>
                usuarios.map(u =>
                    u.id === id ? { ...u, status: 1 } : u
                )
            );
        } catch {
            alert("Erro ao ativar usuário.");
        }
        setAtivandoId(null);
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    let conteudoUsuarios;
    if (loading) {
        conteudoUsuarios = (
            <div className="text-gray-400 text-center">Carregando usuários...</div>
        );
    } else if (usuarios.length === 0) {
        conteudoUsuarios = (
            <div className="text-gray-400 text-center">Nenhum usuário encontrado.</div>
        );
    } else {
        conteudoUsuarios = (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {usuarios.map(usuario => (
                    <UsuarioCard
                        key={usuario.id}
                        usuario={usuario}
                        onDesativar={handleDesativarUsuario}
                        onAtivar={handleAtivarUsuario}
                        desativando={desativandoId === usuario.id}
                        ativando={ativandoId === usuario.id}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">Usuários do Sistema</h1>
                    {conteudoUsuarios}
                </main>
            </div>
        </div>
    );
}