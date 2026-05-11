import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// ── Public routes ─────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Protected routes ──────────────────────────────────────────
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.post("/change-password", authenticate, changePassword);

export default router;
