import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import config from "../config/env";

// ──────────────────────────────────────────────────────────────
// JWT Payload shape
// ──────────────────────────────────────────────────────────────

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// ──────────────────────────────────────────────────────────────
// authenticate — Verify JWT & attach user to req.user
// ──────────────────────────────────────────────────────────────

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      data: null,
      message: "Không có token xác thực. Vui lòng đăng nhập.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      data: null,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

export const authMiddleware = authenticate;
