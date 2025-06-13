"use client";

import { useState } from "react";
import { Filter, Search, ChevronDown } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

export default function ProductsPage() {
  // Estado para los filtros
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    priceRange: "",
    sortBy: "recent",
  });

  // Estado para mostrar/ocultar filtros en móvil
  const [showFilters, setShowFilters] = useState(false);

  // Datos de ejemplo para productos
  const products = [
    {
      id: 1,
      title: "Libro de Cálculo Avanzado",
      category: "Libros",
      type: "Venta",
      price: 250,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Carlos Méndez",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      title: "Laptop Dell Inspiron",
      category: "Electrónicos",
      type: "Venta",
      price: 4500,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Ana Gutiérrez",
      createdAt: "2023-05-14",
    },
    {
      id: 3,
      title: "Sudadera Universitaria",
      category: "Ropa",
      type: "Regalo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Miguel Torres",
      createdAt: "2023-05-13",
    },
    {
      id: 4,
      title: "Calculadora Científica",
      category: "Útiles",
      type: "Préstamo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Laura Sánchez",
      createdAt: "2023-05-12",
    },
    {
      id: 5,
      title: "Libro de Programación en Python",
      category: "Libros",
      type: "Venta",
      price: 180,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Roberto Díaz",
      createdAt: "2023-05-11",
    },
    {
      id: 6,
      title: "Audífonos Bluetooth",
      category: "Electrónicos",
      type: "Venta",
      price: 800,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Patricia López",
      createdAt: "2023-05-10",
    },
    {
      id: 7,
      title: "Mochila Universitaria",
      category: "Útiles",
      type: "Regalo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Fernando Ruiz",
      createdAt: "2023-05-09",
    },
    {
      id: 8,
      title: "Guitarra Acústica",
      category: "Otros",
      type: "Préstamo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Daniela Morales",
      createdAt: "2023-05-08",
    },
  ];

  // Opciones para los filtros
  const categories = ["Libros", "Electrónicos", "Ropa", "Útiles", "Otros"];
  const types = ["Venta", "Préstamo", "Regalo"];
  const priceRanges = ["0-500", "500-1000", "1000-5000", "5000+"];
  const sortOptions = [
    { value: "recent", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "price_asc", label: "Precio: menor a mayor" },
    { value: "price_desc", label: "Precio: mayor a menor" },
  ];

  // Manejador de cambios en los filtros
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  // Función para aplicar filtros a los productos
  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.type && product.type !== filters.type) return false;

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        // Para el caso "5000+"
        if (product.price < min) return false;
      }
    }

    return true;
  });

  // Función para ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "recent":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explorar Artículos</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <div className="hidden md:block">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`md:w-64 ${showFilters ? "block" : "hidden"} md:block`}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Filtros</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categoría</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="category-all"
                    name="category"
                    checked={filters.category === ""}
                    onChange={() => handleFilterChange("category", "")}
                    className="mr-2"
                  />
                  <label htmlFor="category-all">Todas</label>
                </div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={filters.category === category}
                      onChange={() => handleFilterChange("category", category)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category}`}>{category}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Tipo</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="type-all"
                    name="type"
                    checked={filters.type === ""}
                    onChange={() => handleFilterChange("type", "")}
                    className="mr-2"
                  />
                  <label htmlFor="type-all">Todos</label>
                </div>
                {types.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={`type-${type}`}
                      name="type"
                      checked={filters.type === type}
                      onChange={() => handleFilterChange("type", type)}
                      className="mr-2"
                    />
                    <label htmlFor={`type-${type}`}>{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Rango de Precio</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-all"
                    name="priceRange"
                    checked={filters.priceRange === ""}
                    onChange={() => handleFilterChange("priceRange", "")}
                    className="mr-2"
                  />
                  <label htmlFor="price-all">Todos</label>
                </div>
                {priceRanges.map((range) => (
                  <div key={range} className="flex items-center">
                    <input
                      type="radio"
                      id={`price-${range}`}
                      name="priceRange"
                      checked={filters.priceRange === range}
                      onChange={() => handleFilterChange("priceRange", range)}
                      className="mr-2"
                    />
                    <label htmlFor={`price-${range}`}>
                      {range.includes("+")
                        ? `$${range.replace("+", "")}+`
                        : `$${range.replace("-", " - $")}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Sort Options */}
            <div className="md:hidden mb-6">
              <h3 className="font-medium mb-2">Ordenar por</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={() =>
                setFilters({
                  category: "",
                  type: "",
                  priceRange: "",
                  sortBy: "recent",
                })
              }
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {sortedProducts.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">
                {sortedProducts.length} artículos encontrados
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No se encontraron artículos con los filtros seleccionados.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    category: "",
                    type: "",
                    priceRange: "",
                    sortBy: "recent",
                  })
                }
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
