"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  PieChart,
  Users,
  Package,
  Gift,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminService } from "../services/adminService.js";
import CategoryPie from "../components/admin/CategoryPie";
import ActivityBar from "../components/admin/ActivityBar";

export default function AdminDashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Navegación interna
  const [activeTab, setActiveTab] = useState("dashboard");

  // Cards (resumen)
  const [cards, setCards] = useState([]);

  // Datos para tablas/listados
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Gráficas y estadísticas
  const [categoryStats, setCategoryStats] = useState([]);
  const [activity, setActivity] = useState({ itemsPerDay: [] });

  // Highlights
  const [highlights, setHighlights] = useState({
    featured: [],
    recent: [],
    mostRequested: [],
  });

  // Usuarios (CRUD)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Confirmaciones
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [showConfirmDeleteUser, setShowConfirmDeleteUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Helpers
  const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);

  // Ver producto
  const handleViewProduct = (product) => {
    const id = product.id ?? product.id_item;
    const url = `/producto/${id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Eliminar producto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await adminService.deleteItem(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showSuccess("Producto eliminado correctamente");
    } catch (err) {
      showError("Error al eliminar el producto");
    } finally {
      setShowConfirmDelete(false);
      setProductToDelete(null);
    }
  };

  // Guardar usuario (crear/editar)
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id_user || editingUser.id, {
          username: userForm.username,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status,
          ...(userForm.password ? { password: userForm.password } : {}),
        });
        showSuccess("Usuario actualizado");
      } else {
        await adminService.createUser({
          username: userForm.username,
          email: userForm.email,
          password: userForm.password || "changeme123",
          role: userForm.role,
          status: userForm.status,
        });
        showSuccess("Usuario creado");
      }
      setUserForm({
        username: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
      });
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      showError("No se pudo guardar el usuario");
    }
  };

  const handleEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      username: u.username || "",
      email: u.email || "",
      password: "",
      role: u.role || "user",
      status: u.status || "active",
    });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id_user || userToDelete.id);
      showSuccess("Usuario eliminado");
      setUsers((prev) =>
        prev.filter(
          (u) => (u.id_user || u.id) !== (userToDelete.id_user || userToDelete.id)
        )
      );
    } catch (err) {
      console.error(err);
      showError("No se pudo eliminar el usuario");
    } finally {
      setShowConfirmDeleteUser(false);
      setUserToDelete(null);
    }
  };

  // Redirección por rol + carga inicial
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user || user.role !== "admin") {
        navigate("/", { replace: true });
      } else {
        loadDashboardData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1) Resumen general (cards)
      const statsData = await adminService.getGeneralStats();
      const newCards = [
        {
          label: "Usuarios Registrados",
          value: statsData?.general?.totalUsers ?? 0,
          icon: Users,
          color: "bg-blue-100 text-blue-600",
        },
        {
          label: "Artículos Activos",
          value: statsData?.general?.totalItems ?? 0,
          icon: Package,
          color: "bg-emerald-100 text-emerald-600",
        },
        {
          label: "Artículos Donados",
          value: statsData?.general?.soldItems ?? 0,
          icon: Gift,
          color: "bg-purple-100 text-purple-600",
        },
        // Nota: "Pendientes de revisión" eliminado según lo solicitado
      ];
      setCards(newCards);

      // 2) Gráficas — categorías y actividad (últimos 30 días)
      setCategoryStats(statsData?.categoryStats || []);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      const activityData =
        (await adminService.getStatsByDateRange(
          fmtDate(start),
          fmtDate(end)
        )) || {};
      setActivity(activityData || { itemsPerDay: [] });

      // 3) Productos para tabla
      const itemsData = await adminService.getItems({ page: 1, limit: 10 });
      const transformedProducts =
        itemsData.items?.map((item) => adminService.transformItemData(item)) ||
        [];
      setProducts(transformedProducts);

      // 4) Highlights (destacados / recientes / más solicitados)
      const hi = await adminService.getHighlights(10);
      setHighlights({
        featured: hi?.featured || [],
        recent: hi?.recent || [],
        mostRequested: hi?.mostRequested || [],
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Error al cargar los datos del dashboard");

      // Fallback a mocks si existen
      try {
        const mock = adminService.getMockData?.();
        if (mock) {
          setCards(mock.stats || []);
          setProducts(mock.products || []);
          setCategoryStats(mock.categoryStats || []);
          setActivity(mock.activity || { itemsPerDay: [] });
        }
      } catch (_) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos con filtros (pestaña Artículos)
  const loadProducts = async (filters = {}) => {
    try {
      const itemsData = await adminService.getItems({
        page: currentPage,
        limit: 10,
        ...filters,
      });
      const transformedProducts =
        itemsData.items?.map((item) => adminService.transformItemData(item)) ||
        [];
      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error loading products:", err);
      const mock = adminService.getMockData?.();
      if (mock) setProducts(mock.products || []);
    }
  };

  // Cargar usuarios (pestaña Usuarios)
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await adminService.getUsers?.();
      const list = data?.users || data || [];
      setUsers(list);
    } catch (err) {
      console.error(err);
      showError("No se pudieron cargar los usuarios");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Efectos por cambios de pestaña
  useEffect(() => {
    if (activeTab === "products") {
      loadProducts({ search: searchTerm });
    }
    if (activeTab === "users") {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Buscar en artículos
  useEffect(() => {
    if (activeTab === "products") {
      loadProducts({ search: searchTerm });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Filtrado de artículos en cliente (extra por si acaso)
  const filteredProducts = products.filter(
    (product) =>
      (product.title || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase()) ||
      (product.owner || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase()) ||
      (product.category || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
  );

  // Paginación artículos
  const productsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Formato de fecha amigable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Filtrado usuarios en cliente
  const filteredUsers = users.filter(
    (u) =>
      (u.username || "")
        .toLowerCase()
        .includes((searchUser || "").toLowerCase()) ||
      (u.email || "").toLowerCase().includes((searchUser || "").toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
              src="/vite.svg"
              alt="Logo"
              className="h-9 w-9 rounded-full bg-emerald-100 p-1 shadow"
            />
            <span className="text-xl font-bold text-emerald-700 tracking-tight select-none">
              SIREDU Admin
            </span>
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-3 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 transition focus:outline-none border border-emerald-100 shadow-sm">
              <span className="font-semibold text-emerald-900 text-sm">
                {user?.name || user?.username || "Admin"}
              </span>
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-emerald-600 text-white font-bold text-lg border-2 border-white shadow">
                {(user?.name || user?.username || "A")
                  .charAt(0)
                  .toUpperCase()}
              </span>
              <svg
                className="w-4 h-4 text-emerald-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-semibold text-emerald-800 text-sm truncate">
                  {user?.email || "admin@utez.edu.mx"}
                </div>
                <div className="text-xs text-gray-400">Administrador</div>
              </div>
              <button
                onClick={() => setShowConfirmLogout(true)}
                className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-700 font-medium rounded-b-lg transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Confirm logout */}
      <ConfirmDialog
        open={showConfirmLogout}
        title="¿Cerrar sesión?"
        message="¿Estás seguro de que deseas cerrar sesión?"
        onCancel={() => setShowConfirmLogout(false)}
        onConfirm={() => {
          setShowConfirmLogout(false);
          logout();
          navigate("/");
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Cerrar alerta"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}

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
              onClick={() => {
                setActiveTab("products");
                setCurrentPage(1);
                setSearchTerm("");
                loadProducts();
              }}
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
              onClick={() => {
                setActiveTab("users");
                setSearchUser("");
              }}
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

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((stat, index) => (
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
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold mb-2">Artículos por categoría</h3>
                <CategoryPie data={categoryStats} />
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-semibold mb-2">Actividad (por día)</h3>
                <ActivityBar data={activity?.itemsPerDay || []} />
              </div>
            </div>

            {/* Reportes por estado */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2">Reportes por estado</h3>
              <div className="flex gap-3">
                <button
                  className="px-3 py-2 rounded bg-emerald-600 text-white"
                  onClick={async () => {
                    const blob = await adminService.getItemsByStatusReport("csv");
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "items-by-status.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Descargar CSV
                </button>
              </div>
            </div>

            {/* Actividad reciente (placeholder) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
              <div className="text-gray-500 text-sm">
                Próximamente: feed real de actividad (creaciones, cambios de estado, etc.).
              </div>
            </div>
          </div>
        )}

        {/* ARTÍCULOS */}
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
                            ["available", "approved"].includes(product.status)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {["available", "approved"].includes(product.status)
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 rounded-full hover:bg-emerald-100 transition-colors"
                            title="Ver producto"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="h-4 w-4 text-emerald-600" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Eliminar producto"
                            onClick={() => {
                              setProductToDelete(product);
                              setShowConfirmDelete(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirmación eliminación producto */}
            <ConfirmDialog
              open={showConfirmDelete}
              title="¿Eliminar producto?"
              message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.title}"? Esta acción no se puede deshacer.`}
              onCancel={() => {
                setShowConfirmDelete(false);
                setProductToDelete(null);
              }}
              onConfirm={handleDeleteProduct}
            />

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * productsPerPage + 1} a{" "}
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length
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

        {/* USUARIOS */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold">Gestión de Usuarios</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Formulario Crear/Editar */}
            <form
              onSubmit={handleSubmitUser}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
            >
              <input
                type="text"
                required
                placeholder="Usuario"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, username: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, email: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="password"
                placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
                value={userForm.password}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, password: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, role: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="moderator">moderator</option>
              </select>
              <div className="flex gap-2">
                <select
                  value={userForm.status}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 flex-1"
                >
                  <option value="active">active</option>
                  <option value="disabled">disabled</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium"
                >
                  {editingUser ? "Guardar" : "Crear"}
                </button>
                {editingUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setUserForm({
                        username: "",
                        email: "",
                        password: "",
                        role: "user",
                        status: "active",
                      });
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="py-8 text-center text-gray-500">
                  Cargando usuarios...
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id_user || u.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {u.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (u.status || "active") === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              className="px-2 py-1 rounded border border-gray-300 text-gray-700 text-xs"
                              onClick={() => handleEditUser(u)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-2 py-1 rounded border border-red-300 text-red-600 text-xs"
                              onClick={() => {
                                setUserToDelete(u);
                                setShowConfirmDeleteUser(true);
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          className="px-6 py-6 text-center text-gray-500"
                          colSpan={5}
                        >
                          No hay usuarios que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Confirmación eliminación usuario */}
            <ConfirmDialog
              open={showConfirmDeleteUser}
              title="¿Eliminar usuario?"
              message={`¿Estás seguro de eliminar al usuario "${userToDelete?.username}"? Esta acción no se puede deshacer.`}
              onCancel={() => {
                setShowConfirmDeleteUser(false);
                setUserToDelete(null);
              }}
              onConfirm={handleDeleteUser}
            />
          </div>
        )}

        {/* ESTADÍSTICAS DETALLADAS */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-lg font-semibold">Estadísticas Detalladas</h2>

            {/* Bloques de highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">
                  Artículos destacados (favoritos)
                </h3>
                <ul className="space-y-2">
                  {(highlights.featured || []).slice(0, 10).map((item) => (
                    <li
                      key={item.id_item}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{item.tittle}</span>
                      <a
                        href={`/producto/${item.id_item}`}
                        className="text-emerald-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver
                      </a>
                    </li>
                  ))}
                  {(!highlights.featured ||
                    highlights.featured.length === 0) && (
                    <li className="text-gray-400 text-sm">Sin datos</li>
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Artículos recientes</h3>
                <ul className="space-y-2">
                  {(highlights.recent || []).slice(0, 10).map((item) => (
                    <li
                      key={item.id_item}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{item.tittle}</span>
                      <a
                        href={`/producto/${item.id_item}`}
                        className="text-emerald-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver
                      </a>
                    </li>
                  ))}
                  {(!highlights.recent || highlights.recent.length === 0) && (
                    <li className="text-gray-400 text-sm">Sin datos</li>
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Más solicitados</h3>
                <ul className="space-y-2">
                  {(highlights.mostRequested || []).slice(0, 10).map((item) => (
                    <li
                      key={item.id_item}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{item.tittle}</span>
                      <a
                        href={`/producto/${item.id_item}`}
                        className="text-emerald-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver
                      </a>
                    </li>
                  ))}
                  {(!highlights.mostRequested ||
                    highlights.mostRequested.length === 0) && (
                    <li className="text-gray-400 text-sm">Sin datos</li>
                  )}
                </ul>
              </div>
            </div>

            {/* (Opcional) Reusar las mismas gráficas también aquí */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Artículos por categoría</h3>
                <CategoryPie data={categoryStats} />
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold mb-2">Actividad (por día)</h3>
                <ActivityBar data={activity?.itemsPerDay || []} />
              </div>
            </div>

            {/* Descarga de reportes aquí también si lo deseas */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">Reportes por estado</h3>
              <button
                className="px-3 py-2 rounded bg-emerald-600 text-white"
                onClick={async () => {
                  const blob = await adminService.getItemsByStatusReport("csv");
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "items-by-status.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Descargar CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
