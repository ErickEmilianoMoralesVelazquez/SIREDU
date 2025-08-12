// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import itemsRoutes from "./routes/items.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";

dotenv.config();

const app = express();

// Orígenes permitidos (ajusta FRONTEND_URL si la usas)
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true, // por si algún día usas cookies
  })
);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos: ./files
const UPLOAD_DIR = path.join(process.cwd(), "files");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/files", express.static(UPLOAD_DIR));

// Rutas
app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);
app.use("/admin", adminRoutes);
app.use("/favorites", favoritesRoutes);

app.get("/", (_req, res) => {
  res.send("API Backend funcionando");
});

export default app;
