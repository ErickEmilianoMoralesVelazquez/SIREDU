// src/services/items.js
// FRONT: servicio para consumir ItemsService del backend
// + createItem con FormData (tittle/exchange_type/picture1..3)

import { apiService } from "./api.js";

// Construye URL absoluta para archivos/imagenes servidas desde /files
const fileURL = (name) =>
  name && !String(name).startsWith("http")
    ? `${apiService.baseURL}/files/${name}`
    : name || null;

// Normaliza un item del backend a un modelo de UI consistente
const adaptItem = (raw = {}) => {
  const pictures = [raw.picture1, raw.picture2, raw.picture3].filter(Boolean);

  const images =
    Array.isArray(raw.images) && raw.images.length
      ? raw.images.map(fileURL)
      : pictures.map(fileURL);

  // portada
  const cover =
    raw.image && !String(raw.image).startsWith("http")
      ? fileURL(raw.image)
      : raw.image;

  return {
    id: raw.id ?? raw.id_item ?? raw._id ?? raw.itemId,
    title: raw.title ?? raw.tittle ?? "",
    description: raw.description ?? "",
    price: Number(raw.price || 0),
    category: raw.category ?? "",
    type: raw.type ?? raw.exchange_type ?? "", // "Venta" | "Préstamo" | "Regalo"
    image: cover || images[0] || "/placeholder.svg?height=300&width=300",
    images,
    owner: raw.owner ?? raw.User?.username ?? "Usuario desconocido",
    createdAt: raw.createdAt ?? raw.created_at ?? null,
    isFavorite: !!raw.isFavorite,
    favoriteCount: Number(raw.favoriteCount || 0),
    status: raw.status ?? "available",
    // extras que tu backend agrega en getItemById:
    condition: raw.condition,
    faculty: raw.faculty,
    user:
      raw.user ||
      (raw.User
        ? {
            id_user: raw.User.id_user,
            username: raw.User.username,
            email: raw.User.email,
            phoneNumber: raw.User.phoneNumber,
          }
        : undefined),
  };
};

// Normaliza respuestas que contienen lista + paginación
const adaptListResponse = (payload = {}) => {
  // payload puede ser:
  //  a) { success, data: [items], pagination }
  //  b) { items, pagination }
  //  c) { data: { items, pagination } } (menos común)
  //  d) lista directa

  // Si viene { success, data: [...] }
  if (Array.isArray(payload?.data)) {
    const itemsRaw = payload.data;
    const pagination =
      payload.pagination || {
        total: Number(itemsRaw.length),
        currentPage: 1,
        totalPages: 1,
        limit: Number(itemsRaw.length || 12),
      };
    return {
      list: itemsRaw.map(adaptItem),
      pagination,
    };
  }

  // Si viene directo como array
  if (Array.isArray(payload)) {
    return {
      list: payload.map(adaptItem),
      pagination: {
        total: Number(payload.length),
        currentPage: 1,
        totalPages: 1,
        limit: Number(payload.length || 12),
      },
    };
  }

  // Si viene { items, pagination } o { data: { items, pagination } }
  const p = payload && payload.data && !Array.isArray(payload.data) ? payload.data : payload;
  const itemsRaw = p.items || p.results || p.data || [];
  const pagination =
    p.pagination ||
    payload.pagination || {
      total: Number(Array.isArray(itemsRaw) ? itemsRaw.length : 0),
      currentPage: Number(p.currentPage ?? p.page ?? 1),
      totalPages: Number(p.totalPages ?? 1),
      limit: Number(
        p.limit ?? (Array.isArray(itemsRaw) ? itemsRaw.length : 12)
      ),
    };

  return {
    list: Array.isArray(itemsRaw) ? itemsRaw.map(adaptItem) : [],
    pagination,
  };
};

// -------- Endpoints --------

// GET /items  (con filtros/paginación)
export async function listItems(params = {}) {
  const payload = await apiService.get("/items", { params });
  return adaptListResponse(payload);
}

// GET /items/:id
export async function getItemById(id) {
  const payload = await apiService.get(`/items/${id}`);
  const p = payload && payload.data !== undefined ? payload.data : payload;
  const raw = (p && p.item) || p;
  return adaptItem(raw);
}

// GET /items/categories
export async function getCategories() {
  const payload = await apiService.get("/items/categories");
  const p = payload && payload.data !== undefined ? payload.data : payload;
  return Array.isArray(p) ? p : [];
}

// GET /items/types
export async function getTypes() {
  const payload = await apiService.get("/items/types");
  const p = payload && payload.data !== undefined ? payload.data : payload;
  return Array.isArray(p) ? p : [];
}

// GET /items/filter-stats
export async function getFilterStats() {
  const payload = await apiService.get("/items/filter-stats");
  return (payload && payload.data !== undefined ? payload.data : payload) || {};
}

// GET /items/popular?limit=&category=
export async function getPopularItems({ limit = 10, category = "" } = {}) {
  const payload = await apiService.get("/items/popular", {
    params: { limit, category },
  });
  const p = payload && payload.data !== undefined ? payload.data : payload;
  const data = (p && p.items) || p;
  return Array.isArray(data) ? data.map(adaptItem) : [];
}

// GET /items/recommendations?userId=&limit=
export async function getRecommendations({ userId, limit = 10 } = {}) {
  const payload = await apiService.get("/items/recommendations", {
    params: { userId, limit },
  });
  const p = payload && payload.data !== undefined ? payload.data : payload;
  const data = (p && p.items) || p;
  return Array.isArray(data) ? data.map(adaptItem) : [];
}

// GET o POST /items/advanced-search (según tu router)
export async function advancedSearch(params = {}) {
  // Si tu ruta fuera POST:
  // const payload = await apiService.post("/items/advanced-search", params);
  const payload = await apiService.get("/items/advanced-search", { params });
  return adaptListResponse(payload);
}

// POST /items  (crear) — mapea al modelo real del back
// POST /items  (crear) — mapea al modelo real del back
export async function createItem(payload) {
  const fd = new FormData();

  // Texto
  const title = (payload.title || "").trim();
  const description = (payload.description || "").trim();
  const category = payload.category || "";

  // Normaliza el tipo a minúsculas para la lógica del precio
  const typeRaw = (payload.type || "").toLowerCase(); // "venta" | "regalo" | "prestamo"  (también cubre "Venta")
  const TYPE_MAP = { venta: "Venta", regalo: "Regalo", prestamo: "Préstamo" };
  const exchangeType = TYPE_MAP[typeRaw] || payload.type || "";

  // Precio correcto: solo si es venta
  const priceNum = typeRaw === "venta" ? Number(payload.price || 0) : 0;

  // Enviar ambos nombres por compatibilidad con el back
  fd.append("tittle", title);
  fd.append("title", title);
  fd.append("description", description);
  fd.append("price", String(priceNum));
  fd.append("category", category);
  fd.append("exchange_type", exchangeType);
  fd.append("type", exchangeType);
  fd.append("phoneNumber", payload.phoneNumber);

  // Archivos: picture1..3
  const files = Array.isArray(payload.images) ? payload.images : [];
  if (files[0]) fd.append("picture1", files[0]);
  if (files[1]) fd.append("picture2", files[1]);
  if (files[2]) fd.append("picture3", files[2]);

  const resp = await apiService.postForm("/items", fd);
  const p = resp && resp.data !== undefined ? resp.data : resp;
  return adaptItem((p && p.item) || p);
}

