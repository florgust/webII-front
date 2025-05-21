"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import LogoutModal from "./LogoutModal";

interface HeaderMenuProps {
    showSearch?: boolean;
}

export default function HeaderMenu({ showSearch = true }: HeaderMenuProps) {
    const [search, setSearch] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/buscar?query=${encodeURIComponent(search)}`);
            setSearch("");
            setMobileMenuOpen(false);
        }
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

    return (
        <>
            <header className="w-full bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between relative z-50">
                <a href="/menu" className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 select-none">
                    Boscov
                </a>

                {/* Desktop: barra de busca e ações */}
                {showSearch && (
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
                            {showSearch && (
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
            <LogoutModal open={logoutOpen} onClose={handleLogoutClose} />
        </>
    );
}