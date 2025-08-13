"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { listItems, getCategories, getTypes } from "../services/items";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Filtros controlados
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    sortBy: "recent", // recent | oldest | price_asc | price_desc | popular
    page: 1,
    limit: 12,
  });

  // Opciones de filtros desde el backend
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Datos
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sincroniza querystring → filtros (q, category, type, sort, page)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const sortBy = searchParams.get("sort") || "recent";
    const page = Number(searchParams.get("page") || 1);

    setFilters((f) => ({
      ...f,
      search: q,
      category,
      type,
      sortBy,
      page,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Carga opciones de filtros
  useEffect(() => {
    (async () => {
      try {
        const [cats, tps] = await Promise.all([getCategories(), getTypes()]);
        setCategories(cats);
        setTypes(tps);
      } catch {
        // silenciar
      }
    })();
  }, []);

  // Llama a /items cuando cambian los filtros
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { list, pagination } = await listItems(filters);
        if (!cancel) {
          setItems(list);
          setPagination(pagination);
        }
      } catch (e) {
        if (!cancel) setError(e.message || "Error al cargar artículos");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [JSON.stringify(filters)]);

  const totalPages = useMemo(
    () => Math.max(1, Number(pagination?.totalPages || 1)),
    [pagination]
  );

  const handleChangeFilter = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <header className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Artículos</h1>
          <p className="text-gray-500">
            Explora los artículos publicados por la comunidad.
          </p>
        </div>
      </header>

      {/* Barra de filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Buscar por título o descripción"
            value={filters.search}
            onChange={(e) => handleChangeFilter("search", e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.category}
          onChange={(e) => handleChangeFilter("category", e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.type}
          onChange={(e) => handleChangeFilter("type", e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.sortBy}
          onChange={(e) => handleChangeFilter("sortBy", e.target.value)}
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="popular">Populares</option>
        </select>
      </div>

      {/* Contenido */}
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <div className="text-gray-600">No hay artículos.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Paginación */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))
              }
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {pagination.currentPage} de {totalPages}
            </span>
            <button
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
