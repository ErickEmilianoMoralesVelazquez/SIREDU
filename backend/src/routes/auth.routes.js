import { Router } from "express";
import { register, login, forgotPassword, validateResetToken, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

export default router;
