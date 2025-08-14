import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
  getItemFavoriteCount,
  getMostFavoritedItems,
  getUserFavoriteStats
} from "../controllers/favorites.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as favorites from "../controllers/favorites.controller.js"; // 👈 AQUI importamos



const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// ===== RUTAS DE GESTIÓN DE FAVORITOS =====

// Agregar artículo a favoritos
router.post("/items/:itemId/favorite", addToFavorites);

// Remover artículo de favoritos
router.delete("/items/:itemId/favorite", removeFromFavorites);

// Obtener favoritos del usuario
router.get("/favorites", getUserFavorites);

// Verificar si un artículo está en favoritos
router.get("/items/:itemId/favorite", checkFavoriteStatus);

// Obtener contador de favoritos de un artículo
router.get("/items/:itemId/favorite-count", getItemFavoriteCount);

// Obtener artículos más favoriteados
router.get("/most-favorited", getMostFavoritedItems);

// Obtener estadísticas de favoritos del usuario
router.get("/favorites/stats", getUserFavoriteStats);

router.post("/items/:id/favorite", authenticate, favorites.add);
// Quitar de favoritos
router.delete("/items/:id/favorite", authenticate, favorites.remove);
// Saber si es favorito
router.get("/items/:id/favorite", authenticate, favorites.status);
// Listar mis favoritos
router.get("/favorites", authenticate, favorites.list);
// (opcional) top más marcados
router.get("/favorites/most-favorited", authenticate, favorites.mostFavorited);

export default router; 