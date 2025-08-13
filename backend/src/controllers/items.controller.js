import Item from "../models/Item.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import FavoritesService from "../services/favoritesService.js";
import ItemsService from "../services/itemsService.js";

export const getAllItems = async (req, res) => {
  try {
    const userId = req.user?.id_user || null;
    const result = await ItemsService.getItems(req.query, userId);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los artículos",
      error: error.message,
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id_user || null;

    const item = await ItemsService.getItemById(id, userId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Artículo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error getting item by id:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el artículo",
      error: error.message,
    });
  }
};

export const createItem = async (req, res) => {
  try {
    // Requiere usuario autenticado
    const user_id = req.user?.id_user ?? req.user?.id ?? null;
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    // Acepta ambos nombres de campos desde el front
    const {
      tittle,
      title,
      description = "",
      price,
      category = "",
      exchange_type,
      type,
      status,
      phoneNumber,
    } = req.body;

    const finalTitle = (tittle || title || "").trim();
    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: "El título (tittle/title) es obligatorio",
      });
    }

    // Normalización del tipo
    const TYPE_MAP = {
      venta: "Venta",
      regalo: "Regalo",
      prestamo: "Préstamo",
      "préstamo": "Préstamo",
    };
    const rawType = String(exchange_type || type || "").trim();
    const finalType = TYPE_MAP[rawType.toLowerCase()] || rawType;

    const priceNum = Number(price || 0);

    // Tomar solo filename de multer
    const picture1 = req.files?.picture1?.[0]?.filename || null;
    const picture2 = req.files?.picture2?.[0]?.filename || null;
    const picture3 = req.files?.picture3?.[0]?.filename || null;

    // Crear usando columnas reales del modelo
    const item = await Item.create({
      tittle: finalTitle,
      description,
      price: priceNum,
      category,
      exchange_type: finalType,
      status: status || "available",
      user_id,
      phoneNumber: phoneNumber?.trim() || null,
      picture1,
      picture2,
      picture3,
    });

    // Volver a leer con include de User (incluye id_user para el front)
    const itemWithUser = await Item.findByPk(item.id_item, {
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "email"],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Artículo creado exitosamente",
      data: itemWithUser,
    });
  } catch (error) {
    console.error("Error creando artículo:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear el artículo",
      error: error.message,
    });
  }
};

// ===== ACTUALIZAR ARTÍCULO =====
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id_user ?? req.user?.id ?? null;

    if (!userId) {
      return res.status(401).json({ success: false, message: "No autenticado" });
    }

    // Buscar el artículo y validar propiedad
    const item = await Item.findOne({ where: { id_item: id, user_id: userId } });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Artículo no encontrado o no tienes permisos para modificarlo",
      });
    }

    // Extraer campos permitidos
    const {
      tittle,
      title,
      description,
      price,
      category,
      exchange_type,
      type,
      phoneNumber,
    } = req.body || {};

    const updates = {};

    if (typeof tittle === "string" || typeof title === "string") {
      const finalTitle = (tittle || title || "").trim();
      if (!finalTitle) {
        return res.status(400).json({ success: false, message: "El título es obligatorio" });
      }
      updates.tittle = finalTitle;
    }

    if (typeof description === "string") updates.description = description;

    if (price !== undefined) {
      const priceNum = Number(price || 0);
      if (Number.isNaN(priceNum)) {
        return res.status(400).json({ success: false, message: "El precio debe ser numérico" });
      }
      updates.price = priceNum;
    }

    if (typeof category === "string" && category.trim().length > 0) {
      updates.category = category;
    }

    // Normalizar tipo de intercambio
    if (exchange_type !== undefined || type !== undefined) {
      const TYPE_MAP = { venta: "Venta", regalo: "Regalo", prestamo: "Préstamo", "préstamo": "Préstamo" };
      const rawType = String(exchange_type || type || "").trim();
      const finalType = TYPE_MAP[rawType.toLowerCase()] || rawType;
      updates.exchange_type = finalType;
    }

    // Actualizar phoneNumber del artículo si llega en la edición
    if (phoneNumber !== undefined) {
      updates.phoneNumber = phoneNumber?.trim() || null;
    }

    // Archivos opcionales (reemplazan solo si vienen nuevos)
    const picture1 = req.files?.picture1?.[0]?.filename || null;
    const picture2 = req.files?.picture2?.[0]?.filename || null;
    const picture3 = req.files?.picture3?.[0]?.filename || null;

    if (picture1) updates.picture1 = picture1;
    if (picture2) updates.picture2 = picture2;
    if (picture3) updates.picture3 = picture3;

    await item.update(updates);

    // Volver a leer con include de User
    const itemWithUser = await Item.findByPk(item.id_item, {
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Artículo actualizado exitosamente",
      data: itemWithUser,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el artículo",
      error: error.message,
    });
  }
};

// ===== OBTENER CATEGORÍAS DISPONIBLES =====
export const getCategories = async (req, res) => {
  try {
    const categories = await ItemsService.getCategories();
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

// ===== OBTENER TIPOS DISPONIBLES =====
export const getTypes = async (req, res) => {
  try {
    const types = await ItemsService.getTypes();
    
    res.status(200).json({
      success: true,
      data: types,
    });
  } catch (error) {
    console.error("Error getting types:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los tipos",
      error: error.message,
    });
  }
};

// ===== OBTENER ESTADÍSTICAS DE FILTROS =====
export const getFilterStats = async (req, res) => {
  try {
    const stats = await ItemsService.getFilterStats();
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting filter stats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de filtros",
      error: error.message,
    });
  }
};

// ===== BÚSQUEDA AVANZADA =====
export const advancedSearch = async (req, res) => {
  try {
    const userId = req.user?.id_user || null;
    const result = await ItemsService.advancedSearch(req.query, userId);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      filters: result.appliedFilters
    });
  } catch (error) {
    console.error("Error in advanced search:", error);
    res.status(500).json({
      success: false,
      message: "Error en la búsqueda avanzada",
      error: error.message,
    });
  }
};

// ===== ACTUALIZAR ESTADO DEL ARTÍCULO =====
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id_user || null;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const result = await ItemsService.updateItemStatus(id, userId, status);

    res.status(200).json({
      success: true,
      message: "Estado del artículo actualizado exitosamente",
      data: result.item
    });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el estado del artículo",
      error: error.message,
    });
  }
};

// ===== ELIMINAR ARTÍCULO =====
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id_user || null;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    await ItemsService.deleteItem(id, userId);

    res.status(200).json({
      success: true,
      message: "Artículo eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al eliminar el artículo",
      error: error.message,
    });
  }
};

// ===== OBTENER ARTÍCULOS DEL USUARIO AUTENTICADO =====
export const getMyItems = async (req, res) => {
  try {
    const userId = req.user?.id_user || null;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const result = await ItemsService.getMyItems(userId, req.query);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Error getting my items:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tus artículos",
      error: error.message,
    });
  }
};
