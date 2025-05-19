import Link from "next/link";

interface HeaderProps {
  showRegister?: boolean;
  showLogin?: boolean;
}

export default function Header({
  showRegister = true,
  showLogin = true,
}: Readonly<HeaderProps>) {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-neutral-800 shadow">
      <Link href="/inicial" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 select-none cursor-pointer">
          Boscov
        </span>
      </Link>
      <nav className="flex gap-4">
        {showLogin && (
          <Link
            href="/login"
            className="text-neutral-200 hover:text-white transition-colors font-medium"
          >
            Login
          </Link>
        )}
        {showRegister && (
          <Link
            href="/registrar"
            className="text-neutral-200 hover:text-white transition-colors font-medium"
          >
            Registrar
          </Link>
        )}
      </nav>
    </header>
  );
}