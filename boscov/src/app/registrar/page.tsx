"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Modal from "@/components/SucessoOuErro";
import { apiFetch } from "@/config/apiFetch";

interface FormState {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    dataNascimento: string;
    apelido?: string;
}

export default function RegistrarPage() {
    const [form, setForm] = useState<FormState>({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        dataNascimento: "",
        apelido: "",
    });
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [modal, setModal] = useState<{ open: boolean; type: "success" | "error"; message: string }>({ open: false, type: "success", message: "" });
    const router = useRouter();

    const validate = () => {
        const newErrors: Partial<FormState> = {};
        if (!form.nome) newErrors.nome = "Nome é obrigatório";
        if (!form.email) newErrors.email = "Email é obrigatório";
        if (!form.senha) newErrors.senha = "Senha é obrigatória";
        if (!form.confirmarSenha) newErrors.confirmarSenha = "Confirme sua senha";
        if (form.senha && form.confirmarSenha && form.senha !== form.confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem";
        if (form.senha && !/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d)/.test(form.senha)) newErrors.senha = "Senha deve ter número e caractere especial";
        if (!form.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            // Troque a URL abaixo pela do seu backend
            const payload = {
                ...form,
                data_nascimento: form.dataNascimento,
            };
            if (!payload.apelido) delete payload.apelido;

            const res = await apiFetch("/usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setModal({ open: true, type: "success", message: "Usuário criado com sucesso!" });
                setTimeout(() => {
                    setModal({ ...modal, open: false });
                    router.push("/login");
                }, 2000);
            } else {
                console.log(res);
                setModal({ open: true, type: "error", message: "Tente novamente mais tarde." });
                setTimeout(() => setModal({ ...modal, open: false }), 2000);
            }
        } catch {
            setModal({ open: true, type: "error", message: "Tente novamente mais tarde." });
            setTimeout(() => setModal({ ...modal, open: false }), 2000);
        }
    };

    return (
        <main className="flex flex-col min-h-screen">
            <Header showRegister={false} showLogin={true} />
            <Modal open={modal.open} type={modal.type} message={modal.message} />
            <section className="flex flex-1 flex-col items-center justify-center px-4">
                <form onSubmit={handleSubmit} className="bg-neutral-800 p-8 rounded shadow-lg w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Crie sua conta</h2>
                    <div>
                        {errors.nome && <p className="text-red-400 text-sm mb-1">{errors.nome}</p>}
                        <label htmlFor="nome" className="block text-gray-300 mb-1">Nome</label>
                        <input id="nome" type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <div>
                        {errors.email && <p className="text-red-400 text-sm mb-1">{errors.email}</p>}
                        <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <div>
                        {errors.senha && <p className="text-red-400 text-sm mb-1">{errors.senha}</p>}
                        <label htmlFor="senha" className="block text-gray-300 mb-1">Senha</label>
                        <input id="senha" type="password" name="senha" value={form.senha} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <div>
                        {errors.confirmarSenha && <p className="text-red-400 text-sm mb-1">{errors.confirmarSenha}</p>}
                        <label htmlFor="confirmarSenha" className="block text-gray-300 mb-1">Confirmar Senha</label>
                        <input id="confirmarSenha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <div>
                        {errors.dataNascimento && <p className="text-red-400 text-sm mb-1">{errors.dataNascimento}</p>}
                        <label htmlFor="dataNascimento" className="block text-gray-300 mb-1">Data de Nascimento</label>
                        <input id="dataNascimento" type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <div>
                        <label htmlFor="apelido" className="block text-gray-300 mb-1">Apelido <span className="text-gray-500">(opcional)</span></label>
                        <input id="apelido" type="text" name="apelido" value={form.apelido} onChange={handleChange} className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500" />
                    </div>
                    <button type="submit" className="w-full py-2 mt-2 rounded bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition">
                        Registrar
                    </button>
                </form>
            </section>
        </main>
    );
}