import { User } from "../models/index.js";

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const user = await User.findByPk(req.user.id_user);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador" });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error("Error en middleware de admin:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; 