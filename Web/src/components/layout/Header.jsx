import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDropdown from "../ui/UserDropdown.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Datos de ejemplo para productos (mismos que en HomePage)
  const allProducts = [
    {
      id: 1,
      title: "Libro de Cálculo Avanzado",
      category: "Libros",
      type: "Venta",
      price: 250,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Carlos Méndez",
    },
    {
      id: 2,
      title: "Laptop Dell Inspiron",
      category: "Electrónicos",
      type: "Venta",
      price: 4500,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Ana Gutiérrez",
    },
    {
      id: 3,
      title: "Sudadera Universitaria",
      category: "Ropa",
      type: "Regalo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Miguel Torres",
    },
    {
      id: 4,
      title: "Calculadora Científica",
      category: "Útiles",
      type: "Préstamo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Laura Sánchez",
    },
    {
      id: 5,
      title: "Diccionario de Inglés",
      category: "Libros",
      type: "Venta",
      price: 150,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Roberto Díaz",
    },
    {
      id: 6,
      title: "Mochila Escolar",
      category: "Útiles",
      type: "Venta",
      price: 200,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Carmen López",
    },
    {
      id: 7,
      title: "Tablet Samsung",
      category: "Electrónicos",
      type: "Venta",
      price: 2800,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Diego Ramírez",
    },
    {
      id: 8,
      title: "Jeans Universitarios",
      category: "Ropa",
      type: "Regalo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Sofia Martínez",
    },
  ];

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = allProducts.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.type.toLowerCase().includes(searchLower) ||
        product.owner.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProducts(filtered);
    setShowSearchResults(true);
  }, [searchTerm]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
    setShowSearchResults(false);
  };

  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId) => {
    // Solo hacer scroll si estamos en la página principal
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        // Scroll más lento con animación 
        const targetPosition = element.offsetTop - 80; 
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1300; 
        let start = null;

        function animation(currentTime) {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Función de easing para movimiento más suave
        function easeInOutCubic(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
      }
    }
  };

  // Navegar al producto seleccionado
  const handleProductSelect = (productId) => {
    navigate(`/producto/${productId}`);
    clearSearch();
    setIsMenuOpen(false);
  };

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
            <button
              onClick={() => scrollToSection('categorias')}
              className="hover:text-emerald-200 transition-colors cursor-pointer"
            >
              Categorías
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-emerald-200 transition-colors cursor-pointer"
            >
              Cómo Funciona
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-1 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
              />
              <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-500" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-8 top-1.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Resultados de búsqueda del header */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50 w-80">
                  {filteredProducts.length > 0 ? (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="space-y-3">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate text-sm">
                                {product.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
                                  {product.category}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                  {product.type}
                                </span>
                                {product.price > 0 && (
                                  <span className="font-medium text-emerald-600 text-xs">
                                    ${product.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <p>No se encontraron artículos</p>
                      <p className="mt-1">Intenta con otros términos</p>
                    </div>
                  )}
                </div>
              )}
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
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-2 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-grow"
              />
              <Search className="h-5 w-5 text-white -ml-10" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Resultados de búsqueda móvil */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50">
                  {filteredProducts.length > 0 ? (
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="space-y-2">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate text-sm">
                                {product.title}
                              </h4>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full text-xs">
                                  {product.category}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                                  {product.type}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      <p>No se encontraron artículos</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/productos"
                className="hover:text-emerald-200 transition-colors"
              >
                Explorar
              </Link>
              <button
                onClick={() => {
                  scrollToSection('categorias');
                  setIsMenuOpen(false);
                }}
                className="hover:text-emerald-200 transition-colors cursor-pointer text-left"
              >
                Categorías
              </button>
              <button
                onClick={() => {
                  scrollToSection('como-funciona');
                  setIsMenuOpen(false);
                }}
                className="hover:text-emerald-200 transition-colors cursor-pointer text-left"
              >
                Cómo Funciona
              </button>
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
