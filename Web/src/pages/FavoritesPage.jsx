import { Heart, Trash2 } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

export default function FavoritesPage() {
  // Datos de ejemplo estáticos para la maqueta
  const mockFavorites = [
    {
      id: 1,
      title: "iPhone 14 Pro Max",
      category: "Electrónicos",
      type: "Venta",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      owner: "Juan Pérez",
      createdAt: "2024-01-15",
      isFavorite: true
    },
    {
      id: 2,
      title: "MacBook Air M2",
      category: "Computadoras",
      type: "Venta",
      price: 1199.99,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      owner: "María García",
      createdAt: "2024-01-14",
      isFavorite: true
    },
    {
      id: 3,
      title: "Nike Air Max 270",
      category: "Calzado",
      type: "Venta",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      owner: "Carlos López",
      createdAt: "2024-01-13",
      isFavorite: true
    },
    {
      id: 4,
      title: "Samsung Galaxy S23",
      category: "Electrónicos",
      type: "Venta",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
      owner: "Ana Martínez",
      createdAt: "2024-01-12",
      isFavorite: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Favoritos
          </h1>
          <p className="text-gray-600">
            Tienes {mockFavorites.length} artículo{mockFavorites.length > 1 ? 's' : ''} en tus favoritos
          </p>
        </div>

        {/* Lista de Favoritos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {mockFavorites.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              {/* Botón para remover de favoritos */}
              <button
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Remover de favoritos"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Estado vacío (oculto por defecto) */}
        <div className="hidden text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-500 mb-6">
            Cuando le des corazón a un artículo, aparecerá aquí.
          </p>
          <a
            href="/productos"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Explorar productos
          </a>
        </div>
      </div>
    </div>
  );
}
