// backend/src/routes/items.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getAllItems,
  getItemById,
  createItem,
  getCategories,
  getTypes,
  getFilterStats,
  advancedSearch,
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
// (Asumiendo que en app.js montas: app.use("/items", itemsRouter))
router.get("/", getAllItems);
router.get("/search", advancedSearch);
router.get("/categories", getCategories);
router.get("/types", getTypes);
router.get("/filter-stats", getFilterStats);
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
