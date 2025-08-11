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
