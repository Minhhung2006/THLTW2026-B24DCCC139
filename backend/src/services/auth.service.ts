import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import config from "../config/env";
import { AppError } from "../middlewares/error.middleware";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const signToken = (payload: { id: string; email: string; role: string }) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: "7d", // Yêu cầu expire 7d
  } as jwt.SignOptions);

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError("Email đã được sử dụng.", 400);
    }

    // Hash password bcrypt(10)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // role mặc định = USER
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
        role: "USER",
      },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    // user(không có password)
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    // bcrypt.compare
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    // tạo JWT expire 7d
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
