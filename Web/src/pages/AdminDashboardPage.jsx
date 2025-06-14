"use client";

import { useState } from "react";
import {
  BarChart,
  PieChart,
  Users,
  Package,
  Gift,
  Clock,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para estadísticas
  const stats = [
    {
      label: "Usuarios Registrados",
      value: 523,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Artículos Activos",
      value: 1248,
      icon: Package,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Artículos Donados",
      value: 342,
      icon: Gift,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pendientes de Revisión",
      value: 15,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  // Datos de ejemplo para productos
  const products = [
    {
      id: 1,
      title: "Libro de Cálculo Avanzado",
      category: "Libros",
      type: "Venta",
      price: 250,
      owner: "Carlos Méndez",
      status: "active",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      title: "Laptop Dell Inspiron",
      category: "Electrónicos",
      type: "Venta",
      price: 4500,
      owner: "Ana Gutiérrez",
      status: "active",
      createdAt: "2023-05-14",
    },
    {
      id: 3,
      title: "Sudadera Universitaria",
      category: "Ropa",
      type: "Regalo",
      price: 0,
      owner: "Miguel Torres",
      status: "active",
      createdAt: "2023-05-13",
    },
    {
      id: 4,
      title: "Calculadora Científica",
      category: "Útiles",
      type: "Préstamo",
      price: 0,
      owner: "Laura Sánchez",
      status: "inactive",
      createdAt: "2023-05-12",
    },
    {
      id: 5,
      title: "Libro de Programación en Python",
      category: "Libros",
      type: "Venta",
      price: 180,
      owner: "Roberto Díaz",
      status: "active",
      createdAt: "2023-05-11",
    },
  ];

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Paginación
  const productsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "dashboard"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "products"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              Artículos
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "users"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "stats"
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <PieChart className="h-5 w-5 mr-2" />
              Estadísticas
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                  Artículos por Categoría
                </h2>
                <div className="h-64 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=250&width=400"
                    alt="Gráfico de categorías"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                  Actividad Mensual
                </h2>
                <div className="h-64 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=250&width=400"
                    alt="Gráfico de actividad"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Nuevo artículo publicado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Carlos Méndez
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Libro de Cálculo Avanzado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Hace 2 horas
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Artículo marcado como entregado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Ana Gutiérrez
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Laptop Dell Inspiron
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Hace 5 horas
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Nuevo usuario registrado
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Miguel Torres
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Hace 1 día
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Content */}
        {activeTab === "products" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold">Gestión de Artículos</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.price > 0 ? `$${product.price}` : "Gratis"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * productsPerPage + 1} a{" "}
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length,
                  )}{" "}
                  de {filteredProducts.length} artículos
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Content */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-6">Gestión de Usuarios</h2>
            <p className="text-gray-600">Contenido de gestión de usuarios...</p>
          </div>
        )}

        {/* Stats Content */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-6">
              Estadísticas Detalladas
            </h2>
            <p className="text-gray-600">
              Contenido de estadísticas detalladas...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
