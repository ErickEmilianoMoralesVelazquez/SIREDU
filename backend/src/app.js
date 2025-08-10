import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import itemsRoutes from "./routes/items.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);
app.use("/admin", adminRoutes);
app.use("/favorites", favoritesRoutes);

app.get("/", (req, res) => {
  res.send("API Backend funcionando");
});

export default app;
