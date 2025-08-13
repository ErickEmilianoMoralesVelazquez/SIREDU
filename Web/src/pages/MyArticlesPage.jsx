import { FileText, Edit, Trash2, Eye, Heart, ChevronDown } from "lucide-react";
import { useMyItems } from "../hooks/useMyItems";
import DeleteConfirmDialog from "../components/ui/DeleteConfirmDialog";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyArticlesPage() {
  const navigate = useNavigate();
  
  // Estados para el diálogo de eliminación
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    itemId: null,
    itemTitle: "",
    isLoading: false
  });

  // Usar hook para obtener artículos del backend
  const { 
    items: myArticles, 
    loading, 
    error, 
    stats, 
    handleDeleteItem, 
    handleUpdateStatus, 
    refreshItems 
  } = useMyItems();

  // Menú de estado abierto por artículo
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 ring-green-200";
      // Para mantener compatibilidad con estados existentes
      case "reserved":
      case "sold":
        return "bg-red-100 text-red-800 ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-200";
    }
  };

  const getStatusLabel = (article) => {
    const status = article.status;
    if (status === "available") return "Disponible";
    // Para mantener compatibilidad con estados existentes
    if (status === "reserved" || status === "sold") return "No disponible";
    return "Desconocido";
  };

  const getStatusOptions = (article) => {
    // Devuelve [{value,label}] - Simplificado para mostrar solo disponible/no disponible
    // Usamos "sold" del backend para representar "No disponible"
    return [
      { value: "available", label: "Disponible" },
      { value: "sold", label: "No disponible" }
    ];
  };

  // Función para abrir el diálogo de eliminación
  const openDeleteDialog = (itemId, itemTitle) => {
    setDeleteDialog({
      isOpen: true,
      itemId,
      itemTitle,
      isLoading: false
    });
  };

  // Función para cerrar el diálogo de eliminación
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      itemId: null,
      itemTitle: "",
      isLoading: false
    });
  };

  // Función para confirmar la eliminación
  const confirmDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));
    
    const result = await handleDeleteItem(deleteDialog.itemId);
    
    if (result.success) {
      closeDeleteDialog();
    } else {
      // Aquí podrías mostrar un toast de error
      console.error('Error al eliminar:', result.error);
    }
    
    setDeleteDialog(prev => ({ ...prev, isLoading: false }));
  };

  // Función para cambiar el estado del artículo
  const handleStatusChange = async (itemId, newStatus) => {
    const result = await handleUpdateStatus(itemId, newStatus);
    if (!result.success) {
      console.error('Error al actualizar estado:', result.error);
    }
  };

  // Función para navegar a editar artículo
  const handleEditItem = (item) => {
    // Navegar a la página de crear artículo con los datos del artículo para edición
    navigate('/publicar', { 
      state: { 
        editMode: true, 
        itemData: item 
      } 
    });
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
            {loading ? 'Cargando...' : `Tienes ${stats.total} artículo${stats.total > 1 ? 's' : ''} publicados`}
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
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.total}
                </p>
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
                  {loading ? '...' : stats.interested}
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
                  {loading ? '...' : stats.active}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Artículos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refreshItems} 
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
                ) : myArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {myArticles.map((article) => {
              // Funciones auxiliares (no hooks)
              const getCover = () => {
                return article.image || article.images?.[0] || "/placeholder.svg?height=300&width=300";
              };

              const getPriceLabel = () => {
                return article.price > 0
                  ? new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                      maximumFractionDigits: 2,
                    }).format(article.price)
                  : article.type === "Préstamo"
                  ? "Préstamo"
                  : "Gratis";
              };

              const getTypeBadge = (type) => {
                switch (type) {
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
                <article key={article.id} className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-md">
                  {/* Imagen */}
                  <Link to={`/articulos/${article.id}`} className="block">
                    <div className="relative aspect-[4/3] bg-gray-50">
                      <img
                        src={getCover()}
                        alt={article.title || "Artículo"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                      {/* Badge de tipo */}
                      {article.type && (
                        <span
                          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTypeBadge(
                            article.type
                          )}`}
                        >
                          {article.type}
                        </span>
                      )}
                      
                      {/* Botones de acción en la esquina superior derecha */}
                      <div className="absolute right-3 top-3 flex gap-2">
                        {/* Botón editar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditItem(article);
                          }}
                          className="grid size-9 place-items-center rounded-full bg-white/85 backdrop-blur text-blue-600 shadow-sm ring-1 ring-blue-200 transition-colors hover:bg-white hover:text-blue-700"
                          title="Editar artículo"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        
                        {/* Botón eliminar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteDialog(article.id, article.title);
                          }}
                          className="grid size-9 place-items-center rounded-full bg-white/85 backdrop-blur text-red-600 shadow-sm ring-1 ring-red-200 transition-colors hover:bg-white hover:text-red-700"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Badge de estado */}
                      <span className={`absolute left-3 bottom-3 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadge(article.status)}`}>
                        {getStatusLabel(article)}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Contenido */}
                  <div className="p-4">
                    {article.category && (
                      <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                        {article.category}
                      </p>
                    )}
                    
                    <h3 className="mb-2 font-medium text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        {getPriceLabel()}
                      </span>
                      {article.favoriteCount > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                          {article.favoriteCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Menú de cambio de estado */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenStatusMenuId(prev => (prev === article.id ? null : article.id))}
                        className={`w-full inline-flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          article.status === 'available'
                            ? 'border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                            : 'border-red-200 text-red-800 bg-red-50 hover:bg-red-100'
                        }`}
                        title="Cambiar estado"
                      >
                        <span>{getStatusLabel(article)}</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </button>

                      {openStatusMenuId === article.id && (
                        <div className="mt-2 w-full rounded-lg border bg-white shadow-sm">
                          <ul className="py-1 text-sm">
                            {getStatusOptions(article).map((opt) => (
                              <li key={opt.value}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenStatusMenuId(null);
                                    handleStatusChange(article.id, opt.value);
                                  }}
                                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                    article.status === opt.value ? 'text-emerald-700 font-semibold' : 'text-gray-700'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
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
        )}

      </div>
      
      {/* Diálogo de confirmación para eliminar */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemTitle={deleteDialog.itemTitle}
        isLoading={deleteDialog.isLoading}
      />

    </div>
  );
}
