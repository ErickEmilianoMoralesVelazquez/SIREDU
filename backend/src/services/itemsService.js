import { Item, User } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";
import FavoritesService from "./favoritesService.js";

class ItemsService {
  // ===== OBTENER ARTÍCULOS CON FILTROS Y PAGINACIÓN =====
  
  static async getItems(params = {}, userId = null) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        category, 
        type, 
        priceRange, 
        sortBy = "created_at" 
      } = params;
      
      const offset = (page - 1) * limit;

      // Construir where clause
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { tittle: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (category) {
        whereClause.category = category;
      }
      
      if (type) {
        whereClause.exchange_type = type;
      }
      
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          whereClause.price = {
            [Op.between]: [min, max]
          };
        } else {
          // Para el caso "5000+"
          whereClause.price = {
            [Op.gte]: min
          };
        }
      }

      // Determinar ordenamiento
      let orderClause = [["created_at", "DESC"]];
      switch (sortBy) {
        case "oldest":
          orderClause = [["created_at", "ASC"]];
          break;
        case "price_asc":
          orderClause = [["price", "ASC"]];
          break;
        case "price_desc":
          orderClause = [["price", "DESC"]];
          break;
        case "recent":
        default:
          orderClause = [["created_at", "DESC"]];
          break;
      }

      const items = await Item.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["id_user", "username", "email"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: orderClause,
      });

      // Agregar información de favoritos
      const itemsWithFavorites = await FavoritesService.addFavoriteInfoToItems(items.rows, userId);

      // Transformar datos para el frontend
      const transformedItems = itemsWithFavorites.map(item => ({
        id: item.id_item,
        title: item.tittle,
        description: item.description,
        price: parseFloat(item.price) || 0,
        category: item.category,
        type: item.exchange_type,
        image: item.picture1 || "/placeholder.svg?height=300&width=300",
        images: [
          item.picture1,
          item.picture2,
          item.picture3
        ].filter(Boolean),
        owner: item.User?.username || "Usuario desconocido",
        createdAt: item.created_at,
        isFavorite: item.isFavorite || false,
        favoriteCount: item.favoriteCount || 0,
        status: item.status,
        user: {
          id_user: item.User?.id_user,
          username: item.User?.username,
          email: item.User?.email
        }
      }));

      return {
        items: transformedItems,
        pagination: {
          total: items.count,
          currentPage: parseInt(page),
          totalPages: Math.ceil(items.count / limit),
          limit: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Error getting items:', error);
      throw error;
    }
  }

  // ===== OBTENER ARTÍCULO POR ID =====
  
  static async getItemById(itemId, userId = null) {
    try {
      const item = await Item.findByPk(itemId, {
        include: [
          {
            model: User,
            attributes: ["id_user", "username", "email"],
          },
        ],
      });

      if (!item) {
        return null;
      }

      // Agregar información de favoritos
      const itemWithFavorites = await FavoritesService.addFavoriteInfoToItem(item, userId);

      // Transformar datos para el frontend
      const transformedItem = {
        id: itemWithFavorites.id_item,
        title: itemWithFavorites.tittle,
        description: itemWithFavorites.description,
        price: parseFloat(itemWithFavorites.price) || 0,
        category: itemWithFavorites.category,
        type: itemWithFavorites.exchange_type,
        images: [
          itemWithFavorites.picture1,
          itemWithFavorites.picture2,
          itemWithFavorites.picture3
        ].filter(Boolean),
        owner: itemWithFavorites.User?.username || "Usuario desconocido",
        createdAt: itemWithFavorites.created_at,
        isFavorite: itemWithFavorites.isFavorite || false,
        favoriteCount: itemWithFavorites.favoriteCount || 0,
        status: itemWithFavorites.status,
        condition: "Usado - Buen estado", // Campo adicional para el frontend
        faculty: "Ingeniería", // Campo adicional para el frontend
        user: {
          id_user: itemWithFavorites.User?.id_user,
          username: itemWithFavorites.User?.username,
          email: itemWithFavorites.User?.email
        }
      };

      return transformedItem;
    } catch (error) {
      console.error('Error getting item by id:', error);
      throw error;
    }
  }

  // ===== OBTENER CATEGORÍAS DISPONIBLES =====
  
  static async getCategories() {
    try {
      const categories = await Item.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
        raw: true
      });

      return categories.map(cat => cat.category).filter(Boolean);
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // ===== OBTENER TIPOS DISPONIBLES =====
  
  static async getTypes() {
    try {
      const types = await Item.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('exchange_type')), 'type']],
        raw: true
      });

      return types.map(type => type.type).filter(Boolean);
    } catch (error) {
      console.error('Error getting types:', error);
      throw error;
    }
  }

  // ===== OBTENER ARTÍCULOS POPULARES =====
  
  static async getPopularItems(limit = 10, category = null) {
    try {
      return await FavoritesService.getMostFavoritedItems(limit, category);
    } catch (error) {
      console.error('Error getting popular items:', error);
      throw error;
    }
  }

  // ===== OBTENER RECOMENDACIONES =====
  
  static async getRecommendations(userId, limit = 10) {
    try {
      return await FavoritesService.getRecommendations(userId, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }
}

export default ItemsService; 