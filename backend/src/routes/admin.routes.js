import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import {
  // Moderación de publicaciones
  getAllItems,
  getItemById,
  updateItemStatus,
  deleteItem,
  
  // Estadísticas
  getGeneralStats,
  getStatsByDateRange,
  
  // Gestión de usuarios
  getAllUsers,
  updateUserStatus,
  
  // Gestión de solicitudes
  getAllRequests,
  updateRequestStatus,
  
  // Informes
  generateActivityReport,
  generateModerationReport
} from "../controllers/admin.controller.js";

const router = Router();

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// ===== RUTAS DE MODERACIÓN DE PUBLICACIONES =====
router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.put("/items/:id/status", updateItemStatus);
router.delete("/items/:id", deleteItem);

// ===== RUTAS DE ESTADÍSTICAS =====
router.get("/stats/general", getGeneralStats);
router.get("/stats/date-range", getStatsByDateRange);

// ===== RUTAS DE GESTIÓN DE USUARIOS =====
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);

// ===== RUTAS DE GESTIÓN DE SOLICITUDES =====
router.get("/requests", getAllRequests);
router.put("/requests/:id/status", updateRequestStatus);

// ===== RUTAS DE INFORMES =====
router.get("/reports/activity", generateActivityReport);
router.get("/reports/moderation", generateModerationReport);

export default router; 