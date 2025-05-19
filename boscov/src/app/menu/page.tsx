import Sidebar from "@/components/Sidebar";

export default function MenuPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                {/* Conteúdo do menu aqui */}
                <h1 className="text-2xl text-gray-100">Bem-vindo ao menu!</h1>
            </main>
        </div>
    );
}