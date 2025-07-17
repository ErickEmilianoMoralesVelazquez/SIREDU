import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, User, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDropdown from "../ui/UserDropdown.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-emerald-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl">SIREDU</h1>
              <p className="text-xs text-emerald-200">Consumo Responsable</p>
            </div>
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/productos"
              className="hover:text-emerald-200 transition-colors"
            >
              Explorar
            </Link>
            <Link
              to="/categorias"
              className="hover:text-emerald-200 transition-colors"
            >
              Categorías
            </Link>
            <Link
              to="/como-funciona"
              className="hover:text-emerald-200 transition-colors"
            >
              Cómo Funciona
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="pl-3 pr-10 py-1 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
              />
              <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-500" />
            </div>
          </nav>

          {/* Acciones de usuario en escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/publicar"
                  className="bg-white text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Publicar Artículo
                </Link>
                <UserDropdown user={user} onLogout={logout} />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  to="/login?mode=register"
                  className="bg-white text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="pl-3 pr-10 py-2 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-grow"
              />
              <Search className="h-5 w-5 text-white -ml-10" />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/productos"
                className="hover:text-emerald-200 transition-colors"
              >
                Explorar
              </Link>
              <Link
                to="/categorias"
                className="hover:text-emerald-200 transition-colors"
              >
                Categorías
              </Link>
              <Link
                to="/como-funciona"
                className="hover:text-emerald-200 transition-colors"
              >
                Cómo Funciona
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/publicar"
                    className="bg-white text-emerald-700 px-4 py-2 rounded-full text-center text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Publicar Artículo
                  </Link>
                  <Link
                    to="/perfil"
                    className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Mi Perfil ({user?.username || "Usuario"})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center space-x-1 hover:text-emerald-200 transition-colors text-left"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 hover:text-emerald-200 transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/login?mode=register"
                    className="bg-white text-emerald-700 px-4 py-2 rounded-full text-center text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
