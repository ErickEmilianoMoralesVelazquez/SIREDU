"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  AlertCircle,
  QrCode,
} from "lucide-react";
import InterestModal from "../components/products/InterestModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Datos de ejemplo para el producto
  const product = {
    id: 1,
    title: "Libro de Cálculo Avanzado - Tercera Edición",
    description:
      "Libro de cálculo avanzado en excelente estado. Usado durante un semestre para la materia de Cálculo III. Tiene algunas anotaciones a lápiz que pueden ser borradas. Ideal para estudiantes de ingeniería o ciencias exactas.",
    category: "Libros",
    type: "Venta",
    price: 250,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    owner: "Carlos Méndez",
    faculty: "Ingeniería",
    createdAt: "2023-05-15",
    condition: "Usado - Buen estado",
  };

  // Función para navegar entre imágenes
  const navigateImages = (direction) => {
    if (direction === "next") {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    } else {
      setCurrentImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length,
      );
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.images[currentImage] || "/placeholder.svg"}
              alt={`${product.title} - Imagen ${currentImage + 1}`}
              className="w-full h-96 object-contain"
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImages("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateImages("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className={`absolute top-4 right-4 ${getTypeBadgeColor(product.type)} px-3 py-1 rounded-full text-sm font-medium`}
            >
              {product.type}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    currentImage === index
                      ? "border-emerald-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500 uppercase">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {product.price > 0 ? (
                <p className="text-2xl font-bold text-emerald-600 mt-2">
                  ${product.price.toFixed(2)} MXN
                </p>
              ) : (
                <p className="text-2xl font-bold text-emerald-600 mt-2">
                  {product.type === "Préstamo" ? "Préstamo temporal" : "Gratis"}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Descripción</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Condición</h3>
                <p className="font-medium">{product.condition}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Facultad</h3>
                <p className="font-medium">{product.faculty}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Publicado por</h3>
                <p className="font-medium">{product.owner}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Fecha de publicación</h3>
                <p className="font-medium">{formatDate(product.createdAt)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Estoy interesado
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center gap-2 bg-gray-100 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <QrCode className="h-5 w-5" />
                {showQR ? "Ocultar QR" : "Ver QR"}
              </button>
            </div>

            {showQR && (
              <div className="mt-6 p-4 bg-white border rounded-lg flex flex-col items-center">
                <h3 className="font-medium mb-2">Código QR del artículo</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Código QR del artículo"
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Escanea este código para compartir
                </p>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  Recuerda que los intercambios deben realizarse dentro del
                  campus universitario por seguridad. La universidad no se hace
                  responsable por transacciones realizadas fuera del campus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle={product.title}
      />
    </div>
  );
}
