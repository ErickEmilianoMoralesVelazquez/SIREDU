import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Backend funcionando");
});

export default app;
