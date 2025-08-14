"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  AlertCircle,
  QrCode,
  BookOpen,
  Building2,
  User as UserIcon,
  CalendarClock,
} from "lucide-react";
import InterestModal from "../components/products/InterestModal";
import QRCode from "qrcode";
import { getItemById } from "../services/items";
import { favoritesService } from "../services/favoritesService";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const urlbase = "http://localhost:3000/producto/";

  // Carga del artículo
  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const data = await getItemById(id);
        if (!cancel) {
          setItem(data);
          setIsFav(!!data.isFavorite);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  const images = useMemo(
    () => (item?.images?.length ? item.images : item?.image ? [item.image] : []),
    [item]
  );

  const hasMultipleImages = images.length > 1;

  const navigateImages = useCallback(
    (direction) => {
      if (!hasMultipleImages) return;
      if (direction === "next") {
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    },
    [hasMultipleImages, images.length]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Venta":
        return "bg-blue-100 text-blue-900 ring-1 ring-blue-200";
      case "Préstamo":
        return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
      case "Regalo":
        return "bg-green-100 text-green-900 ring-1 ring-blue-200";
      default:
        return "bg-gray-100 text-gray-900 ring-1 ring-gray-200";
    }
  };

  // Función auxiliar para simplificar el estado del artículo
  const isItemAvailable = (status) => {
    return status === "available";
  };

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (canShare) await navigator.share({ title: item?.title, url });
      else await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!showQR) return;
      const data = await generarQRCode();
      if (!cancelled) setQrDataUrl(data || null);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [showQR, item?.id]);

  const generarQRCode = async () => {
    const url = `${urlbase}${item?.id}`;
    try {
      const qrBase64 = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      return qrBase64;
    } catch (error) {
      console.error("Error al generar el QR:", error);
      return "";
    }
  };

  if (loading || !item) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li className="hover:text-gray-700 transition-colors">Inicio</li>
          <li className="opacity-50">/</li>
          <li className="hover:text-gray-700 transition-colors">{item.category}</li>
          <li className="opacity-50">/</li>
          <li className="text-gray-700 line-clamp-1">{item.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Galería */}
        <div className="lg:w-1/2">
          <div className="relative rounded-2xl bg-gray-50 overflow-hidden shadow-sm">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
            <div id="product-image" className="relative aspect-[4/3] w-full max-h-[320px]">
              {images.length > 0 && (
                <img
                  key={currentImage}
                  src={images[currentImage]}
                  alt={`${item.title} - Imagen ${currentImage + 1} de ${images.length}`}
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ease-out"
                  loading="eager"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={() => navigateImages("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Imagen anterior"
                    aria-controls="product-image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigateImages("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Imagen siguiente"
                    aria-controls="product-image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/85 text-gray-700 text-xs font-medium shadow-sm">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}

              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(
                  item.type
                )}`}
              >
                {item.type}
              </div>
            </div>
          </div>

          {/* Miniaturas */}
          {hasMultipleImages && (
            <div className="mt-4 flex space-x-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  aria-current={currentImage === index}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-200 hover:shadow-sm hover:-translate-y-px ${currentImage === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-gray-200"
                    }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="lg:w-1/2">
          <div className="flex flex-col h-full">
            {/* Encabezado */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs tracking-wide text-gray-500 uppercase">
                    {item.category}
                  </span>
                  <h1 className="mt-1 text-4xl font-bold leading-tight text-gray-900">
                    {item.title}
                  </h1>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      className={`size-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm grid place-items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isFav ? "ring-1 ring-emerald-200" : ""
                        }`}
                      aria-pressed={isFav}
                      onClick={async () => {
                        try {
                          const id = Number(params.id); // según tu ruta /producto/:id
                          const status = await favoritesService.isFavorite(id);
                          if (status?.isFavorite) {
                            await favoritesService.remove(id);
                            setIsFav(false);
                            setFavCount((n) => Math.max(n - 1, 0));
                          } else {
                            await favoritesService.add(id);
                            setIsFav(true);
                            setFavCount((n) => n + 1);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 ${isFav ? "fill-current text-emerald-600" : ""
                          }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="size-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm grid place-items-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="Compartir"
                      title={canShare ? "Compartir" : "Copiar enlace"}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>


                </div>
              </div>

              {/* Precio destacado */}
              <div className="mt-4 inline-flex items-baseline gap-2 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100 shadow-sm">
                {item.price > 0 ? (
                  <p className="text-3xl font-extrabold text-emerald-700">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      maximumFractionDigits: 2,
                    }).format(item.price)}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-emerald-700">
                    {item.type === "Préstamo" ? "Préstamo temporal" : "Gratis"}
                  </p>
                )}
                <span className="text-xs text-emerald-700/70">
                  Precio sugerido por el publicador
                </span>
              </div>


            </div>

            <div className="h-px w-full bg-gray-200/70 mb-6" />

            {/* Descripción */}
            <section className="mb-6">
              <h2 className="font-semibold text-lg mb-2 text-gray-900">
                Descripción
              </h2>
              <p className="text-gray-700 leading-7">{item.description}</p>
            </section>

            {/* Mini cards de info */}
            <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard
                icon={<BookOpen className="h-4 w-4" />}
                label="Condición"
                value={item.condition || "No especificada"}
              />
              <InfoCard
                icon={<Building2 className="h-4 w-4" />}
                label="Facultad"
                value={item.faculty || "No especificada"}
              />
              <InfoCard
                icon={<UserIcon className="h-4 w-4" />}
                label="Publicado por"
                value={item.owner}
              />
              <InfoCard
                icon={<CalendarClock className="h-4 w-4" />}
                label="Fecha de publicación"
                value={
                  <time dateTime={item.createdAt}>
                    {formatDate(item.createdAt)}
                  </time>
                }
              />
            </section>

            {/* Acciones */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => isItemAvailable(item.status) && setIsModalOpen(true)}
                disabled={!isItemAvailable(item.status)}
                className={`flex-1 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow md:active:translate-y-[1px] ${isItemAvailable(item.status)
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isItemAvailable(item.status) ? "Estoy interesado" : "No disponible"}
              </button>
              <button
                /*onClick={() => setShowQR((v) => !v)}*/
                onClick={() => setShowQR((v) => { const next = !v; if (!next) setQrDataUrl(null); return next; })}
                className="flex items-center justify-center gap-2 bg-gray-100 py-3 px-4 rounded-full font-medium hover:bg-gray-200 transition-all shadow-sm hover:shadow"
              >
                <QrCode className="h-5 w-5" />
                {showQR ? "Ocultar QR" : "Ver QR"}
              </button>
            </div>

            {/* QR */}
            {showQR && (
              <div className="mt-6 p-5 bg-white border border-gray-200 rounded-2xl flex flex-col items-center shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-900">
                  Código QR del artículo
                </h3>
                <div className="bg-gray-100 p-4 rounded-xl">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Código QR del artículo"
                      className="w-40 h-40"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">Generando QR…</span>
                  )}
                  {/*<img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Código QR del artículo"
                    className="w-40 h-40"
                    loading="lazy"
                  />*/}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Escanea este código para compartir
                </p>
              </div>
            )}

            {/* Aviso */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
              <div className="shrink-0 grid place-items-center size-8 rounded-full bg-amber-100 text-amber-700">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="text-amber-900 text-sm leading-6">
                Recuerda que los intercambios deben realizarse dentro del campus
                universitario por seguridad. La universidad no se hace
                responsable por transacciones realizadas fuera del campus.
                <button className="ml-2 text-amber-800 underline decoration-amber-300 decoration-2 underline-offset-2 hover:opacity-90">
                  Saber más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra móvil */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            {item.price > 0 ? (
              <div className="inline-flex items-baseline gap-2 rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
                <span className="text-xl font-extrabold text-emerald-700">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(item.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-emerald-700">
                {item.type === "Préstamo" ? "Préstamo" : "Gratis"}
              </span>
            )}
          </div>
          <button
            onClick={() => isItemAvailable(item.status) && setIsModalOpen(true)}
            disabled={!isItemAvailable(item.status)}
            className={`flex-1 py-3 rounded-full font-medium transition-all shadow-sm ${isItemAvailable(item.status)
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {isItemAvailable(item.status) ? "Estoy interesado" : "No disponible"}
          </button>
        </div>
      </div>

      {/* Interest Modal */}
      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phoneNumber={item.phoneNumber}
      />
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mt-0.5 grid place-items-center size-8 rounded-xl bg-gray-100 text-gray-700">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}
