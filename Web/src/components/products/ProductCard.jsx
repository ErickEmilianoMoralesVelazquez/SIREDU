import { Link } from "react-router-dom";
import { Clock, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Función para determinar el color de fondo según el tipo de disponibilidad
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Venta":
        return "bg-blue-100 text-blue-800";
      case "Préstamo":
        return "bg-amber-100 text-amber-800";
      case "Regalo":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/producto/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute top-2 right-2 ${getTypeBadgeColor(product.type)} px-2 py-1 rounded-full text-xs font-medium`}
          >
            {product.type}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-gray-500 uppercase">
              {product.category}
            </span>
            <Link to={`/producto/${product.id}`}>
              <h3 className="font-medium text-lg mb-1 hover:text-emerald-600 transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {product.price > 0 ? (
          <p className="text-lg font-bold text-emerald-600 mt-2">
            ${product.price.toFixed(2)} MXN
          </p>
        ) : (
          <p className="text-lg font-bold text-emerald-600 mt-2">
            {product.type === "Préstamo" ? "Préstamo temporal" : "Gratis"}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>{product.owner}</span>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
