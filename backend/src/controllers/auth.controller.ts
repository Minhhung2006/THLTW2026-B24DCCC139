import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import config from "../config/env";
import { AppError } from "../middlewares/error.middleware";

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

const signToken = (payload: { id: string; email: string; role: string }) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as string,
  } as jwt.SignOptions);

const safeUser = (user: {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
}) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// ──────────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────────

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, fullName, full_name } = req.body;
    const nameToUse = fullName || full_name;

    if (!nameToUse) {
      throw new AppError("Họ và tên là bắt buộc", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email đã được sử dụng.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: nameToUse,
      },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      data: { user: safeUser(user), token },
      message: "Đăng ký thành công!",
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    if (!user.isActive) {
      throw new AppError("Tài khoản đã bị vô hiệu hóa.", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: { user: safeUser(user), token },
      message: "Đăng nhập thành công!",
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/auth/me  (requires authenticate middleware)
// ──────────────────────────────────────────────────────────────

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 404);
    }

    res.json({
      success: true,
      data: { user: safeUser(user) },
      message: "Lấy thông tin thành công.",
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────────
// PUT /api/auth/me  (requires authenticate middleware)
// ──────────────────────────────────────────────────────────────

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
      },
    });

    res.json({
      success: true,
      data: { user: safeUser(user) },
      message: "Cập nhật thông tin thành công.",
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────────
// POST /api/auth/change-password  (requires authenticate)
// ──────────────────────────────────────────────────────────────

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (!user) throw new AppError("Không tìm thấy người dùng.", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError("Mật khẩu hiện tại không đúng.", 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    res.json({
      success: true,
      data: null,
      message: "Đổi mật khẩu thành công.",
    });
  } catch (err) {
    next(err);
  }
};
