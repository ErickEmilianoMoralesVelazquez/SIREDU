import { FileText, Edit, Trash2 } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

export default function MyArticlesPage() {
  // Datos de ejemplo estáticos para la maqueta
  const mockMyArticles = [
    {
      id: 1,
      title: "Libro de Cálculo Avanzado",
      category: "Libros",
      type: "Venta",
      price: 250,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      owner: "Tú",
      createdAt: "2024-01-15",
      isFavorite: false,
      status: "Activo",
      views: 45,
      interested: 3
    },
    {
      id: 2,
      title: "Laptop Dell Inspiron",
      category: "Electrónicos",
      type: "Venta",
      price: 4500,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      owner: "Tú",
      createdAt: "2024-01-14",
      isFavorite: false,
      status: "Activo",
      views: 128,
      interested: 7
    },
    {
      id: 3,
      title: "Calculadora Científica",
      category: "Útiles",
      type: "Préstamo",
      price: 0,
      image: "https://images.unsplash.com/photo-1587145820266-a595abeeceda?w=400&h=300&fit=crop",
      owner: "Tú",
      createdAt: "2024-01-13",
      isFavorite: false,
      status: "Prestado",
      views: 67,
      interested: 2
    },
    {
      id: 4,
      title: "Diccionario de Inglés",
      category: "Libros",
      type: "Venta",
      price: 150,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      owner: "Tú",
      createdAt: "2024-01-12",
      isFavorite: false,
      status: "Vendido",
      views: 89,
      interested: 5
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800 ring-green-200";
      case "Prestado":
        return "bg-amber-100 text-amber-800 ring-amber-200";
      case "Vendido":
        return "bg-blue-100 text-blue-800 ring-blue-200";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Artículos
          </h1>
          <p className="text-gray-600">
            Tienes {mockMyArticles.length} artículo{mockMyArticles.length > 1 ? 's' : ''} publicados
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Artículos</p>
                <p className="text-2xl font-bold text-gray-900">{mockMyArticles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Interesados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockMyArticles.reduce((sum, article) => sum + article.interested, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockMyArticles.filter(article => article.status === "Activo").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Artículos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {mockMyArticles.map((article) => (
            <div key={article.id} className="relative group">
              <ProductCard product={article} />
              
              {/* Overlay con acciones del propietario */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${getStatusBadge(article.status)}`}>
                    {article.status}
                  </span>
                </div>
                
                {/* Botones de acción */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    title="Editar artículo"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Estadísticas del artículo */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {article.interested}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío (oculto por defecto) */}
        <div className="hidden text-center py-16">
          <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes artículos publicados
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza a compartir tus artículos con la comunidad universitaria.
          </p>
          <a
            href="/publicar"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Publicar mi primer artículo
          </a>
        </div>
      </div>
    </div>
  );
}
