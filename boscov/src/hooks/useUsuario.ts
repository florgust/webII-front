"use client";

import { useEffect, useState } from "react";

export function useUsuario() {
    const [usuario, setUsuario] = useState<{ nome?: string } | null>(null);

    useEffect(() => {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
            try {
                setUsuario(JSON.parse(usuarioStr));
            } catch {
                setUsuario(null);
            }
        }
    }, []);

    return usuario;
}