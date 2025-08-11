"use client";

import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useMemo } from "react";

export default function ProductCard({ product, onToggleFavorite }) {
  const {
    id,
    image,
    images = [],
    title,
    price = 0,
    type = "",
    category = "",
    isFavorite = false,
    favoriteCount = 0,
  } = product || {};

  const cover = useMemo(() => {
    const first = image || images[0] || "/placeholder.svg?height=300&width=300";
    return first;
  }, [image, images]);

  const priceLabel =
    price > 0
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          maximumFractionDigits: 2,
        }).format(price)
      : type === "Préstamo"
      ? "Préstamo"
      : "Gratis";

  const typeBadge = (t) => {
    switch (t) {
      case "Venta":
        return "bg-blue-100 text-blue-900 ring-blue-200";
      case "Préstamo":
        return "bg-amber-100 text-amber-900 ring-amber-200";
      case "Regalo":
        return "bg-green-100 text-green-900 ring-green-200";
      default:
        return "bg-gray-100 text-gray-900 ring-gray-200";
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-md">
      {/* Imagen */}
      <Link to={`/articulos/${id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-50">
          <img
            src={cover}
            alt={title || "Artículo"}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
          {/* Badge de tipo */}
          {type && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${typeBadge(
                type
              )}`}
            >
              {type}
            </span>
          )}
          {/* Botón favorito */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.(product);
            }}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 backdrop-blur text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-white"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-emerald-600" : ""}`} />
          </button>

          {/* Contador de favoritos (opcional) */}
          {favoriteCount > 0 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200 shadow-sm">
              {favoriteCount} ♥
            </span>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4">
        {category && (
          <div className="mb-1 text-xs uppercase tracking-wide text-gray-500">
            {category}
          </div>
        )}
        <Link to={`/articulos/${id}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-emerald-700">
            {title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-emerald-700">
            <span className="text-sm font-medium">Precio</span>
            <div className="text-lg font-bold leading-tight">{priceLabel}</div>
          </div>

          <Link
            to={`/articulos/${id}`}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
