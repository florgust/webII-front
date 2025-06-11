"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import LogoutModal from "./LogoutModal";
import CriarFilmeModal from "./CriarFilmeModal";

interface HeaderMenuProps {
    showSearch?: boolean;
    onFilmeCriado?: () => void;
    search?: string;
    setSearch?: (value: string) => void;
}

export default function HeaderMenu({
    showSearch = true,
    onFilmeCriado,
    search = "",
    setSearch,
}: Readonly<HeaderMenuProps>) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [criarFilmeOpen, setCriarFilmeOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Busca o usuário do localStorage e verifica se é admin
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
            try {
                const usuario = JSON.parse(usuarioStr);
                setIsAdmin(usuario.tipo_usuario === "admin");
            } catch {
                setIsAdmin(false);
            }
        }
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Não faz nada, busca é local
    };

    const handleLogout = () => {
        localStorage.clear();
        setLogoutOpen(true);
        setMobileMenuOpen(false);
    };

    const handleLogoutClose = () => {
        setLogoutOpen(false);
        router.push("/");
    };

    // Função para abrir o modal de criar filme
    const handleAbrirCriarFilme = () => {
        setCriarFilmeOpen(true);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="w-full bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between relative z-50">
                <a href="/menu" className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 select-none">
                    Boscov
                </a>

                {/* Desktop: barra de busca e ações */}
                {showSearch && setSearch && (
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center bg-neutral-800 rounded px-3 py-1 mx-4 flex-1 max-w-md"
                    >
                        <FiSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Buscar filmes..."
                            className="bg-transparent outline-none text-gray-200 flex-1 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                )}

                <nav className="hidden md:flex items-center gap-4">
                    {isAdmin && (
                        <button
                            type="button"
                            onClick={handleAbrirCriarFilme}
                            className="flex items-center gap-2 px-3 py-2 rounded bg-green-700 hover:bg-green-800 text-white transition"
                        >
                            + Criar novo filme
                        </button>
                    )}
                    <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 text-gray-200 transition"
                    >
                        <FiUser className="text-lg" />
                        <span className="hidden sm:inline">Perfil</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 text-gray-200 transition"
                    >
                        <FiLogOut className="text-lg" />
                        <span className="hidden sm:inline">Sair</span>
                    </button>
                </nav>

                {/* Mobile: menu hamburguer */}
                <button
                    className="md:hidden text-gray-200 text-2xl p-2 rounded hover:bg-neutral-800 transition"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Mobile: menu lateral */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 flex">
                        <button
                            className="flex-1 bg-black/40"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Fechar menu"
                            tabIndex={0}
                            style={{ cursor: "pointer" }}
                        />
                        <div className="w-64 bg-neutral-900 border-l border-neutral-800 flex flex-col p-6 gap-6 animate-slide-in-right">
                            {showSearch && setSearch && (
                                <form onSubmit={handleSearch} className="flex items-center bg-neutral-800 rounded px-3 py-2">
                                    <FiSearch className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Buscar filmes..."
                                        className="bg-transparent outline-none text-gray-200 flex-1 placeholder-gray-400"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </form>
                            )}
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={handleAbrirCriarFilme}
                                    className="flex items-center gap-3 px-3 py-2 rounded bg-green-700 hover:bg-green-800 text-white transition"
                                >
                                    + Criar novo filme
                                </button>
                            )}
                            <Link
                                href="/perfil"
                                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-800 text-gray-200 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FiUser className="text-xl" />
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-800 text-gray-200 transition"
                            >
                                <FiLogOut className="text-xl" />
                                Sair
                            </button>
                        </div>
                    </div>
                )}

                <style>
                    {`
                        @keyframes slide-in-right {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                        }
                        .animate-slide-in-right {
                        animation: slide-in-right 0.2s ease;
                        }
                    `}
                </style>
            </header>
            <CriarFilmeModal
                open={criarFilmeOpen}
                onClose={() => setCriarFilmeOpen(false)}
                onSuccess={onFilmeCriado}
            />
            <LogoutModal open={logoutOpen} onClose={handleLogoutClose} />
        </>
    );
}