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
    const { tittle, description, price, category, exchange_type, status } = req.body;
    const user_id = req.user.id_user;

    const imagePaths = {
      picture1: null,
      picture2: null,
      picture3: null,
    };

    if (req.files) {
      if (req.files.picture1 && req.files.picture1[0]) {
        imagePaths.picture1 = req.files.picture1[0].filename;
      }
      if (req.files.picture2 && req.files.picture2[0]) {
        imagePaths.picture2 = req.files.picture2[0].filename;
      }
      if (req.files.picture3 && req.files.picture3[0]) {
        imagePaths.picture3 = req.files.picture3[0].filename;
      }
    }

    const item = await Item.create({
      tittle,
      description,
      price: parseFloat(price) || 0,
      category,
      exchange_type,
      status: status || "available",
      user_id,
      ...imagePaths,
    });

    const itemWithUser = await Item.findByPk(item.id_item, {
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Artículo creado exitosamente",
      data: itemWithUser,
    });
  } catch (error) {
    res.status(500).json({
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

/*
EJEMPLO DE CÓMO SUBIR UN ARTÍCULO CON IMÁGENES:

POST /items
Content-Type: multipart/form-data
Authorization: Bearer <tu_jwt_token>

Form Data:
- tittle: "Título del artículo"
- description: "Descripción detallada del artículo"
- price: 100.50 (opcional, número)
- category: "Categoría del artículo"
- exchange_type: "Venta" | "Préstamo" | "Regalo"
- status: "available" (opcional, por defecto "available")
- picture1: File1 (opcional, imagen para posición 1)
- picture2: File2 (opcional, imagen para posición 2)  
- picture3: File3 (opcional, imagen para posición 3)

Ejemplo con curl:
curl -X POST http://localhost:3001/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "tittle=Mi Artículo" \
  -F "description=Descripción del artículo" \
  -F "price=150.00" \
  -F "category=Electrónicos" \
  -F "exchange_type=Venta" \
  -F "picture1=@/path/to/image1.jpg" \
  -F "picture3=@/path/to/image3.jpg"

Respuesta exitosa:
{
  "success": true,
  "message": "Artículo creado exitosamente",
  "data": {
    "id_item": 1,
    "tittle": "Mi Artículo",
    "description": "Descripción del artículo",
    "price": "150.00",
    "category": "Electrónicos",
    "exchange_type": "Venta",
    "status": "available",
    "picture1": "1234567890-image1.jpg",
    "picture2": "1234567891-image2.jpg",
    "picture3": null,
    "created_at": "2024-01-01T12:00:00.000Z",
    "user_id": 1,
    "User": {
      "username": "usuario",
      "email": "usuario@email.com"
    }
  }
}
*/