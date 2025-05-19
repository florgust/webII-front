import Header from "@/components/Header";

export default function InicialPage() {
    return (
        <main className="flex flex-col min-h-screen">
            <Header showRegister={true} showLogin={true} />
            <section className="flex flex-1 flex-col items-center justify-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100 text-center">
                    Avalie filmes de forma simples e rápida
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-8 text-center max-w-xl">
                    Descubra, avalie e compartilhe opiniões sobre seus filmes favoritos. Simples, direto e com uma vibe escura elegante.
                </p>
                <div className="flex gap-4">
                    <a
                        href="/login"
                        className="px-6 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white font-semibold transition"
                    >
                        Entrar
                    </a>
                    <a
                        href="/registrar"
                        className="px-6 py-2 rounded border border-neutral-600 text-neutral-200 hover:bg-neutral-800 transition font-semibold"
                    >
                        Registrar
                    </a>
                </div>
            </section>
        </main>
    );
}