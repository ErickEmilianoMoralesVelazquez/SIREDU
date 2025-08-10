import { User, Item, Request } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

// ===== MODERACIÓN DE PUBLICACIONES =====

// Obtener todas las publicaciones con información del usuario
export const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (search) {
      whereClause[Op.or] = [
        { tittle: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const items = await Item.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "email", "role", "status"]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]]
    });

    res.json({
      items: items.rows,
      total: items.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(items.count / limit)
    });
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una publicación específica
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Item.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "email", "role", "status"]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error al obtener publicación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar estado de una publicación
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    await item.update({
      status,
      adminNotes: adminNotes || item.adminNotes
    });

    res.json({ message: "Estado de publicación actualizado correctamente", item });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una publicación
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    await item.destroy();
    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== ESTADÍSTICAS GENERALES =====

// Obtener estadísticas generales
export const getGeneralStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalItems = await Item.count();
    const totalRequests = await Request.count();
    
    const activeUsers = await User.count({ where: { status: "active" } });
    const availableItems = await Item.count({ where: { status: "available" } });
    const soldItems = await Item.count({ where: { status: "sold" } });
    const pendingItems = await Item.count({ where: { status: "pending" } });

    // Estadísticas por categoría
    const categoryStats = await Item.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id_item")), "count"]
      ],
      group: ["category"],
      order: [[sequelize.fn("COUNT", sequelize.col("id_item")), "DESC"]]
    });

    // Estadísticas por tipo
    const typeStats = await Item.findAll({
      attributes: [
        "exchange_type",
        [sequelize.fn("COUNT", sequelize.col("id_item")), "count"]
      ],
      group: ["exchange_type"],
      order: [[sequelize.fn("COUNT", sequelize.col("id_item")), "DESC"]]
    });

    // Items más recientes
    const recentItems = await Item.findAll({
      include: [
        {
          model: User,
          attributes: ["username"]
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 5
    });

    res.json({
      general: {
        totalUsers,
        totalItems,
        totalRequests,
        activeUsers,
        availableItems,
        soldItems,
        pendingItems
      },
      categoryStats,
      typeStats,
      recentItems
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener estadísticas por rango de fechas
export const getStatsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Se requieren fechas de inicio y fin" });
    }

    const whereClause = {
      created_at: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };

    const itemsInRange = await Item.count({ where: whereClause });
    const usersInRange = await User.count({ where: whereClause });
    const requestsInRange = await Request.count({ where: whereClause });

    // Items por día en el rango
    const itemsPerDay = await Item.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("created_at")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id_item")), "count"]
      ],
      where: whereClause,
      group: [sequelize.fn("DATE", sequelize.col("created_at"))],
      order: [[sequelize.fn("DATE", sequelize.col("created_at")), "ASC"]]
    });

    res.json({
      period: { startDate, endDate },
      stats: {
        items: itemsInRange,
        users: usersInRange,
        requests: requestsInRange
      },
      itemsPerDay
    });
  } catch (error) {
    console.error("Error al obtener estadísticas por fecha:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== GESTIÓN DE USUARIOS =====

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (role) whereClause.role = role;
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]]
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar estado de usuario
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await user.update({ status });
    res.json({ message: "Estado de usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error al actualizar estado de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== GESTIÓN DE SOLICITUDES =====

// Obtener todas las solicitudes
export const getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (search) {
      whereClause.message = { [Op.like]: `%${search}%` };
    }

    const requests = await Request.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Item,
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
      order: [["created_at", "DESC"]]
    });

    res.json({
      requests: requests.rows,
      total: requests.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(requests.count / limit)
    });
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar estado de una solicitud
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    await request.update({
      status,
      adminNotes: adminNotes || request.adminNotes
    });

    res.json({ message: "Estado de solicitud actualizado correctamente", request });
  } catch (error) {
    console.error("Error al actualizar estado de solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===== GENERACIÓN DE INFORMES =====

// Generar informe de actividad
export const generateActivityReport = async (req, res) => {
  try {
    const { startDate, endDate, format = "json" } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Se requieren fechas de inicio y fin" });
    }

    const whereClause = {
      created_at: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };

    const report = {
      period: { startDate, endDate },
      generatedAt: new Date(),
      summary: {
        totalItems: await Item.count({ where: whereClause }),
        totalUsers: await User.count({ where: whereClause }),
        totalRequests: await Request.count({ where: whereClause })
      },
      details: {
        itemsByCategory: await Item.findAll({
          attributes: [
            "category",
            [sequelize.fn("COUNT", sequelize.col("id_item")), "count"]
          ],
          where: whereClause,
          group: ["category"]
        }),
        itemsByStatus: await Item.findAll({
          attributes: [
            "status",
            [sequelize.fn("COUNT", sequelize.col("id_item")), "count"]
          ],
          where: whereClause,
          group: ["status"]
        }),
        topUsers: await Item.findAll({
          attributes: [
            "user_id",
            [sequelize.fn("COUNT", sequelize.col("id_item")), "itemCount"]
          ],
          where: whereClause,
          group: ["user_id"],
          order: [[sequelize.fn("COUNT", sequelize.col("id_item")), "DESC"]],
          limit: 10,
          include: [
            {
              model: User,
              attributes: ["username", "email"]
            }
          ]
        })
      }
    };

    if (format === "csv") {
      // Aquí se podría implementar la exportación a CSV
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=report-${startDate}-${endDate}.csv`);
      // Implementar conversión a CSV
    }

    res.json(report);
  } catch (error) {
    console.error("Error al generar informe:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Generar informe de moderación
export const generateModerationReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = startDate && endDate ? {
      created_at: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    } : {};

    const report = {
      period: { startDate, endDate },
      generatedAt: new Date(),
      moderation: {
        pendingReview: await Item.count({ where: { status: "pending" } }),
        approved: await Item.count({ where: { status: "approved" } }),
        rejected: await Item.count({ where: { status: "rejected" } }),
        flagged: await Item.count({ where: { status: "flagged" } })
      },
      recentActions: await Item.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["username"]
          }
        ],
        order: [["updated_at", "DESC"]],
        limit: 20
      })
    };

    res.json(report);
  } catch (error) {
    console.error("Error al generar informe de moderación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; 