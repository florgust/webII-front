"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Modal from "@/components/SucessoOuErro";
import { apiFetch } from "@/config/apiFetch";

interface LoginForm {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", senha: "" });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [modal, setModal] = useState<{ open: boolean; type: "success" | "error"; message: string }>({ open: false, type: "success", message: "" });
  const router = useRouter();

  const validate = () => {
    const newErrors: Partial<LoginForm> = {};
    if (!form.email) newErrors.email = "Email é obrigatório";
    if (!form.senha) newErrors.senha = "Senha é obrigatória";
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
      const res = await apiFetch("/autenticacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setModal({ open: true, type: "success", message: "Login realizado com sucesso!" });
        setTimeout(() => {
          setModal({ ...modal, open: false });
          router.push("/menu");
        }, 2000);
      } else {
        setModal({ open: true, type: "error", message: "Email ou senha inválidos." });
        setTimeout(() => setModal({ ...modal, open: false }), 2000);
      }
    } catch {
      setModal({ open: true, type: "error", message: "Tente novamente mais tarde." });
      setTimeout(() => setModal({ ...modal, open: false }), 2000);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header showRegister={true} showLogin={false} />
      <Modal open={modal.open} type={modal.type} message={modal.message} />
      <section className="flex flex-1 flex-col items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="bg-neutral-800 p-8 rounded shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Entrar</h2>
          <div>
            {errors.email && <p className="text-red-400 text-sm mb-1">{errors.email}</p>}
            <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            {errors.senha && <p className="text-red-400 text-sm mb-1">{errors.senha}</p>}
            <label htmlFor="senha" className="block text-gray-300 mb-1">Senha</label>
            <input
              id="senha"
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-neutral-900 text-gray-100 border border-neutral-700 focus:outline-none focus:border-gray-500"
            />
          </div>
          <button type="submit" className="w-full py-2 mt-2 rounded bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}