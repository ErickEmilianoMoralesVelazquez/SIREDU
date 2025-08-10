import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import itemsRoutes from "./routes/items.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);

app.get("/", (req, res) => {
  res.send("API Backend funcionando");
});

export default app;
