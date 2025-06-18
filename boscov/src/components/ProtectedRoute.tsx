"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/inicial", "/login", "/registrar", "/401", "/403"];
const ADMIN_ROUTES = ["/filmes", "/usuarios"];

function isAdminRoute(pathname: string) {
    return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

// Função para decodificar o token JWT
function parseJwt(token: string) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

export default function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token && !PUBLIC_ROUTES.includes(pathname)) {
            router.replace("/401");
            return;
        }

        // Verifica expiração do token
        if (token) {
            const decoded = parseJwt(token);
            if (!decoded || (decoded.exp && Date.now() >= decoded.exp * 1000)) {
                localStorage.clear();
                router.replace("/401");
                return;
            }
        }

        if (token && isAdminRoute(pathname)) {
            const usuarioStr = localStorage.getItem("usuario");
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
            if (!usuario || usuario.tipo_usuario !== "admin") {
                router.replace("/403");
                return;
            }
        }
        setChecked(true);
    }, [pathname, router]);

    if (!checked && !PUBLIC_ROUTES.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}