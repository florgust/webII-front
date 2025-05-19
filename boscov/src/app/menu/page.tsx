import Sidebar from "@/components/Sidebar";
import HeaderMenu from "@/components/HeaderMenu";

export default function MenuPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    {/* Conteúdo do menu aqui */}
                    <h1 className="text-2xl text-gray-100">Bem-vindo ao menu!</h1>
                </main>
            </div>
        </div>
    );
}