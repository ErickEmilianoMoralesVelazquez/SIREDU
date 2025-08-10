import { Favorite, Item, User } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

class FavoritesService {
  // ===== AGREGAR INFORMACIÓN DE FAVORITOS A ARTÍCULOS =====
  
  // Agregar estado de favorito a un artículo
  static async addFavoriteInfoToItem(item, userId = null) {
    if (!userId) {
      return {
        ...item.toJSON(),
        isFavorite: false,
        favoriteCount: 0
      };
    }

    try {
      // Verificar si el usuario tiene este artículo en favoritos
      const userFavorite = await Favorite.findOne({
        where: {
          user_id: userId,
          item_id: item.id_item
        }
      });

      // Contar total de favoritos del artículo
      const favoriteCount = await Favorite.count({
        where: {
          item_id: item.id_item
        }
      });

      return {
        ...item.toJSON(),
        isFavorite: !!userFavorite,
        favoriteCount: favoriteCount
      };
    } catch (error) {
      console.error('Error adding favorite info to item:', error);
      return {
        ...item.toJSON(),
        isFavorite: false,
        favoriteCount: 0
      };
    }
  }

  // Agregar información de favoritos a múltiples artículos
  static async addFavoriteInfoToItems(items, userId = null) {
    if (!userId) {
      return items.map(item => ({
        ...item.toJSON(),
        isFavorite: false,
        favoriteCount: 0
      }));
    }

    try {
      const itemIds = items.map(item => item.id_item);
      
      // Obtener favoritos del usuario para estos artículos
      const userFavorites = await Favorite.findAll({
        where: {
          user_id: userId,
          item_id: itemIds
        },
        attributes: ['item_id']
      });

      const userFavoriteItemIds = userFavorites.map(fav => fav.item_id);

      // Contar favoritos para cada artículo
      const favoriteCounts = await Favorite.findAll({
        where: {
          item_id: itemIds
        },
        attributes: [
          'item_id',
          [sequelize.fn('COUNT', sequelize.col('id_favorite')), 'count']
        ],
        group: ['item_id']
      });

      const favoriteCountMap = {};
      favoriteCounts.forEach(fav => {
        favoriteCountMap[fav.item_id] = parseInt(fav.dataValues.count);
      });

      // Combinar información
      return items.map(item => ({
        ...item.toJSON(),
        isFavorite: userFavoriteItemIds.includes(item.id_item),
        favoriteCount: favoriteCountMap[item.id_item] || 0
      }));
    } catch (error) {
      console.error('Error adding favorite info to items:', error);
      return items.map(item => ({
        ...item.toJSON(),
        isFavorite: false,
        favoriteCount: 0
      }));
    }
  }

  // ===== OBTENER ARTÍCULOS CON INFORMACIÓN DE FAVORITOS =====
  
  // Obtener artículos con información de favoritos
  static async getItemsWithFavorites(params = {}, userId = null) {
    try {
      const { page = 1, limit = 10, search, category, sort = "created_at" } = params;
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

      // Obtener artículos
      const items = await Item.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["id_user", "username", "email"]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, "DESC"]]
      });

      // Agregar información de favoritos
      const itemsWithFavorites = await this.addFavoriteInfoToItems(items.rows, userId);

      return {
        items: itemsWithFavorites,
        total: items.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(items.count / limit)
      };
    } catch (error) {
      console.error('Error getting items with favorites:', error);
      throw error;
    }
  }

  // Obtener un artículo específico con información de favoritos
  static async getItemWithFavorites(itemId, userId = null) {
    try {
      const item = await Item.findByPk(itemId, {
        include: [
          {
            model: User,
            attributes: ["id_user", "username", "email"]
          }
        ]
      });

      if (!item) {
        return null;
      }

      return await this.addFavoriteInfoToItem(item, userId);
    } catch (error) {
      console.error('Error getting item with favorites:', error);
      throw error;
    }
  }

  // ===== OBTENER ARTÍCULOS POPULARES =====
  
  // Obtener artículos más favoriteados
  static async getMostFavoritedItems(limit = 10, category = null) {
    try {
      const whereClause = {};
      if (category) {
        whereClause.category = category;
      }

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

      return mostFavorited.map(item => ({
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
    } catch (error) {
      console.error('Error getting most favorited items:', error);
      throw error;
    }
  }

  // ===== OBTENER RECOMENDACIONES =====
  
  // Obtener recomendaciones basadas en favoritos del usuario
  static async getRecommendations(userId, limit = 10) {
    try {
      // Obtener categorías favoritas del usuario
      const userFavorites = await Favorite.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Item,
            attributes: ["category"]
          }
        ]
      });

      const favoriteCategories = [...new Set(userFavorites.map(fav => fav.Item.category))];

      if (favoriteCategories.length === 0) {
        // Si no tiene favoritos, devolver artículos populares
        return await this.getMostFavoritedItems(limit);
      }

      // Obtener artículos de categorías favoritas que no estén en favoritos
      const userFavoriteItemIds = userFavorites.map(fav => fav.item_id);

      const recommendations = await Item.findAll({
        where: {
          category: favoriteCategories,
          id_item: {
            [Op.notIn]: userFavoriteItemIds
          }
        },
        include: [
          {
            model: User,
            attributes: ["id_user", "username"]
          }
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit)
      });

      return await this.addFavoriteInfoToItems(recommendations, userId);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }
}

export default FavoritesService; 