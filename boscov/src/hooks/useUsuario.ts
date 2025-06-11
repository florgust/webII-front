"use client";

import { useEffect, useState } from "react";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    apelido: string;
    data_nascimento: string;
    tipo_usuario: string;
}

export function useUsuario() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

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