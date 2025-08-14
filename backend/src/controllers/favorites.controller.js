import { Favorite, Item, User } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

// ===== AGREGAR ARTÍCULO A FAVORITOS =====
export const addToFavorites = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id_user;

    // Verificar que el artículo existe
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    // Verificar que el usuario no está marcando su propio artículo como favorito
    if (item.user_id === userId) {
      return res.status(400).json({ error: "No puedes marcar tu propio artículo como favorito" });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: userId,
        item_id: itemId
      }
    });

    if (existingFavorite) {
      return res.status(409).json({ error: "El artículo ya está en tus favoritos" });
    }

    // Agregar a favoritos
    const favorite = await Favorite.create({
      user_id: userId,
      item_id: itemId
    });

    res.status(201).json({ 
      message: "Artículo agregado a favoritos",
      favorite: {
        id_favorite: favorite.id_favorite,
        item_id: favorite.item_id,
        created_at: favorite.created_at
      }
    });
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== REMOVER ARTÍCULO DE FAVORITOS =====
export const removeFromFavorites = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id_user;

    // Buscar el favorito
    const favorite = await Favorite.findOne({
      where: {
        user_id: userId,
        item_id: itemId
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: "El artículo no está en tus favoritos" });
    }

    // Eliminar de favoritos
    await favorite.destroy();

    res.json({ message: "Artículo removido de favoritos" });
  } catch (error) {
    console.error("Error al remover de favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== OBTENER FAVORITOS DEL USUARIO =====
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { page = 1, limit = 10, search, category, sort = "created_at" } = req.query;
    const offset = (page - 1) * limit;

    // Construir where clause para los artículos
    const itemWhereClause = {};
    if (search) {
      itemWhereClause[Op.or] = [
        { tittle: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) {
      itemWhereClause.category = category;
    }

    // Obtener favoritos con información del artículo y usuario
    const favorites = await Favorite.findAndCountAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Item,
          where: itemWhereClause,
          include: [
            {
              model: User,
              attributes: ["id_user", "username", "email"]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[Item, sort, "DESC"]]
    });

    // Transformar la respuesta
    const transformedFavorites = favorites.rows.map(fav => ({
      id_favorite: fav.id_favorite,
      created_at: fav.created_at,
      item: {
        id_item: fav.Item.id_item,
        tittle: fav.Item.tittle,
        description: fav.Item.description,
        price: fav.Item.price,
        category: fav.Item.category,
        type: fav.Item.type,
        status: fav.Item.status,
        picture1: fav.Item.picture1,
        picture2: fav.Item.picture2,
        picture3: fav.Item.picture3,
        created_at: fav.Item.created_at,
        user: {
          id_user: fav.Item.User.id_user,
          username: fav.Item.User.username,
          email: fav.Item.User.email
        }
      }
    }));

    res.json({
      favorites: transformedFavorites,
      total: favorites.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(favorites.count / limit)
    });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== VERIFICAR SI UN ARTÍCULO ESTÁ EN FAVORITOS =====
export const checkFavoriteStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id_user;

    const favorite = await Favorite.findOne({
      where: {
        user_id: userId,
        item_id: itemId
      }
    });

    res.json({
      isFavorite: !!favorite,
      favoriteId: favorite ? favorite.id_favorite : null
    });
  } catch (error) {
    console.error("Error al verificar estado de favorito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== OBTENER CONTADOR DE FAVORITOS DE UN ARTÍCULO =====
export const getItemFavoriteCount = async (req, res) => {
  try {
    const { itemId } = req.params;

    const count = await Favorite.count({
      where: {
        item_id: itemId
      }
    });

    res.json({ favoriteCount: count });
  } catch (error) {
    console.error("Error al obtener contador de favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== OBTENER ARTÍCULOS MÁS FAVORITEADOS =====
export const getMostFavoritedItems = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    // Construir where clause
    const whereClause = {};
    if (category) {
      whereClause.category = category;
    }

    // Obtener artículos más favoriteados
    const mostFavorited = await Item.findAll({
      where: whereClause,
      include: [
        {
          model: Favorite,
          attributes: []
        },
        {
          model: User,
          attributes: ["id_user", "username"]
        }
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Favorites.id_favorite")), "favoriteCount"]
        ]
      },
      group: ["Item.id_item", "User.id_user"],
      having: sequelize.literal("COUNT(Favorites.id_favorite) > 0"),
      order: [[sequelize.fn("COUNT", sequelize.col("Favorites.id_favorite")), "DESC"]],
      limit: parseInt(limit)
    });

    // Transformar la respuesta
    const transformedItems = mostFavorited.map(item => ({
      id_item: item.id_item,
      tittle: item.tittle,
      description: item.description,
      price: item.price,
      category: item.category,
      type: item.type,
      status: item.status,
      picture1: item.picture1,
      picture2: item.picture2,
      picture3: item.picture3,
      created_at: item.created_at,
      favoriteCount: parseInt(item.dataValues.favoriteCount),
      user: {
        id_user: item.User.id_user,
        username: item.User.username
      }
    }));

    res.json(transformedItems);
  } catch (error) {
    console.error("Error al obtener artículos más favoriteados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== OBTENER ESTADÍSTICAS DE FAVORITOS DEL USUARIO =====
export const getUserFavoriteStats = async (req, res) => {
  try {
    const userId = req.user.id_user;

    // Contar total de favoritos
    const totalFavorites = await Favorite.count({
      where: { user_id: userId }
    });

    // Favoritos por categoría
    const favoritesByCategory = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Item,
          attributes: ["category"]
        }
      ],
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Item.category")), "count"]
      ],
      group: ["Item.category"],
      order: [[sequelize.fn("COUNT", sequelize.col("Item.category")), "DESC"]]
    });

    // Favoritos recientes (últimos 7 días)
    const recentFavorites = await Favorite.count({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      totalFavorites,
      favoritesByCategory: favoritesByCategory.map(item => ({
        category: item.Item.category,
        count: parseInt(item.dataValues.count)
      })),
      recentFavorites
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; 

// Store en memoria: userId -> Set<itemId>
const favStore = new Map();

/** Devuelve el Set de un usuario, creándolo si no existe */
function bucket(userId) {
  const key = String(userId);
  if (!favStore.has(key)) favStore.set(key, new Set());
  return favStore.get(key);
}

/** POST /items/:id/favorite */
export async function add(req, res) {
  const userId = req.user?.id;
  const itemId = Number(req.params.id);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: "Invalid item id" });

  const set = bucket(userId);
  set.add(itemId);
  return res.json({ ok: true });
}

/** DELETE /items/:id/favorite */
export async function remove(req, res) {
  const userId = req.user?.id;
  const itemId = Number(req.params.id);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: "Invalid item id" });

  const set = bucket(userId);
  set.delete(itemId);
  return res.json({ ok: true });
}

/** GET /items/:id/favorite -> { isFavorite: boolean } */
export async function status(req, res) {
  const userId = req.user?.id;
  const itemId = Number(req.params.id);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!Number.isFinite(itemId)) return res.status(400).json({ error: "Invalid item id" });

  const set = bucket(userId);
  return res.json({ isFavorite: set.has(itemId) });
}

/** GET /favorites -> { favorites: [...] }
 *  Estructura compatible con tu FavoritesPage (trae f.item.*)
 */
export async function list(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const set = bucket(userId);
  const favorites = Array.from(set).map((id) => ({
    itemId: id,
    // Devolvemos también un subobjeto "item" para que tu frontend mapee sin romper
    item: {
      id_item: id,
      tittle: `Artículo ${id}`,     // placeholder
      price: 0,
      category: "General",
      exchange_type: "Regalo",
      picture1: "/placeholder.svg",
      favoriteCount: 0,
      created_at: new Date().toISOString(),
      user: { username: "demo" },
    },
  }));

  return res.json({ favorites });
}

/** GET /favorites/most-favorited?limit=10 */
export async function mostFavorited(req, res) {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 10)));

  // Construimos conteos agregando todos los usuarios
  const counts = new Map(); // itemId -> count
  for (const set of favStore.values()) {
    for (const id of set) counts.set(id, (counts.get(id) || 0) + 1);
  }

  const items = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, cnt]) => ({
      itemId: id,
      count: cnt,
      item: {
        id_item: id,
        tittle: `Artículo ${id}`,
        picture1: "/placeholder.svg",
      },
    }));

  return res.json({ items });
}