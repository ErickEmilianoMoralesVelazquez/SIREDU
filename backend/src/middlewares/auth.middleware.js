import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    req.user = user;
    next();
  });
};


export function authenticate(req, res, next) {
  try {
    let token = null;

    const auth = req.headers.authorization || "";
    if (auth.toLowerCase().startsWith("bearer ")) {
      token = auth.slice(7).trim();
    }
    if (!token && req.headers["x-access-token"]) {
      token = String(req.headers["x-access-token"]);
    }
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const secret = process.env.JWT_SECRET || "dev-secret"; // ⚠️ usa variable de entorno en prod
    const payload = jwt.verify(token, secret);

    // normaliza id de usuario
    req.user = {
      id: payload.id || payload.userId || payload.sub,
      ...payload,
    };

    return next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
