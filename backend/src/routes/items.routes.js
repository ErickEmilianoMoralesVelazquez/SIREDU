// backend/src/routes/items.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  getCategories,
  getTypes,
  getFilterStats,
  advancedSearch,
  getMyItems,
  updateItemStatus,
  deleteItem,
} from "../controllers/items.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateCreateItem } from "../middlewares/validation.middleware.js";

const router = Router();

// ===== Carpeta de subidas: ./files en la raíz del proyecto =====
const UPLOAD_DIR = path.join(process.cwd(), "files");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ===== Multer (guarda solo el filename) =====
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const allowedTypes = /jpeg|jpg|png|gif|webp/;
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (_req, file, cb) {
    const extname = allowedTypes.test(
      path.extname(file.originalname || "").toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype || "");
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
  },
});

// ===== Rutas =====
// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
router.get("/", getAllItems);
router.get("/my-items", authenticateToken, (req, res, next) => {
  console.log("🔍 Ruta /my-items interceptada correctamente");
  next();
}, getMyItems); // Mis artículos
router.get("/search", advancedSearch);
router.get("/categories", getCategories);
router.get("/types", getTypes);
router.get("/filter-stats", getFilterStats);

// Rutas para gestión de artículos del usuario
// IMPORTANTE: rutas más específicas antes de "/:id"
router.put("/:id/status", authenticateToken, updateItemStatus);
router.put(
  "/:id",
  authenticateToken,
  upload.fields([
    { name: "picture1", maxCount: 1 },
    { name: "picture2", maxCount: 1 },
    { name: "picture3", maxCount: 1 },
  ]),
  updateItem
);
router.delete("/:id", authenticateToken, deleteItem);

// Esta ruta debe ir AL FINAL para no interceptar las rutas específicas
router.get("/:id", getItemById);

router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "picture1", maxCount: 1 },
    { name: "picture2", maxCount: 1 },
    { name: "picture3", maxCount: 1 },
  ]),
  validateCreateItem,
  createItem
);

export default router;
