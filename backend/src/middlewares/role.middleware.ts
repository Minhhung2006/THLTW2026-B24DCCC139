import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// requireRole — Factory that returns a middleware checking roles
// ──────────────────────────────────────────────────────────────

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Chưa xác thực. Vui lòng đăng nhập.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        data: null,
        message: `Truy cập bị từ chối. Yêu cầu quyền: ${roles.join(" hoặc ")}.`,
      });
      return;
    }

    next();
  };

// ──────────────────────────────────────────────────────────────
// Convenience shortcuts
// ──────────────────────────────────────────────────────────────

/** Chỉ cho phép ADMIN */
export const requireAdmin = requireRole(Role.ADMIN);

/** Cho phép mọi role đã đăng nhập (ADMIN và USER) */
export const requireUser = requireRole(Role.USER, Role.ADMIN);
