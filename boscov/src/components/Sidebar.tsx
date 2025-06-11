"use client";

import Link from "next/link";
import { useUsuario } from "@/hooks/useUsuario";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";

function UserInfo({ nome, onClick, isMobile }: Readonly<{ nome: string; onClick?: () => void; isMobile?: boolean }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center py-6 border-b border-neutral-700 w-full focus:outline-none ${isMobile ? "cursor-pointer" : ""}`}
      tabIndex={0}
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-neutral-900 flex items-center justify-center text-2xl font-bold text-gray-200 mb-2">
        {nome[0]?.toUpperCase() || "U"}
      </div>
      <span className="text-gray-200 font-semibold">{nome}</span>
    </button>
  );
}

interface SidebarLinkProps {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  showText?: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, icon, children, showText = true, onClick }: Readonly<SidebarLinkProps>) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 rounded hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors font-medium w-full text-left"
      >
        <span className="text-xl">{icon}</span>
        {showText && <span className="whitespace-nowrap">{children}</span>}
      </button>
    );
  }
  return (
    <Link
      href={href!}
      className="flex items-center gap-3 px-4 py-3 rounded hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors font-medium"
    >
      <span className="text-xl">{icon}</span>
      {showText && <span className="whitespace-nowrap">{children}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const usuario = useUsuario();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const router = useRouter();

  // Detecta se o usuário é admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (usuario && usuario.tipo_usuario === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [usuario]);

  let sidebarWidth = "w-64";
  if (isMobile) {
    sidebarWidth = isOpen ? "w-48" : "w-16";
  }

  // Detecta se está em tela pequena
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Abre/fecha sidebar no mobile ao clicar no UserInfo
  const handleUserInfoClick = () => {
    if (isMobile) setIsOpen((prev) => !prev);
  };

  // Overlay para fechar sidebar no mobile
  const handleOverlayClick = () => setIsOpen(false);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    setLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setLogoutOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Overlay escuro no mobile quando aberto */}
      {isMobile && isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={handleOverlayClick}
          aria-label="Fechar menu"
          tabIndex={0}
          style={{ all: "unset", cursor: "pointer" }} // Remove estilos nativos do botão
        />
      )}
      <div
        className={`
          z-40 fixed md:sticky md:top-0 left-0 h-screen
          ${sidebarWidth}
          bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-200
        `}
        style={{ top: 0 }}
      >
        <UserInfo nome={usuario?.nome ?? "Usuário"} onClick={handleUserInfoClick} isMobile={isMobile} />
        <nav className="flex flex-col gap-1 mt-6">
          <SidebarLink href="/avaliacoes" icon="🎬" showText={isOpen || !isMobile}>
            Minhas Avaliações
          </SidebarLink>
          <SidebarLink href="/perfil" icon="👤" showText={isOpen || !isMobile}>
            Perfil
          </SidebarLink>
          {/* Aba de usuários só para admin */}
          {isAdmin && (
            <>
              <SidebarLink href="/usuarios" icon="🧑‍💼" showText={isOpen || !isMobile}>
                Usuários
              </SidebarLink>
              <SidebarLink href="/filmes" icon="🎞️" showText={isOpen || !isMobile}>
                Filmes Desativados
              </SidebarLink>
            </>
          )}
          <SidebarLink icon="🚪" showText={isOpen || !isMobile} onClick={handleLogout}>
            Sair
          </SidebarLink>
        </nav>
      </div>
      <LogoutModal open={logoutOpen} onClose={handleLogoutClose} />
    </>
  );
}