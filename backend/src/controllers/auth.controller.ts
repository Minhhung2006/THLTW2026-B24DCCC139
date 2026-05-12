import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AppError } from "../middlewares/error.middleware";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !confirmPassword) {
         throw new AppError("Vui lòng cung cấp đầy đủ thông tin", 400);
      }

      if (password !== confirmPassword) {
        throw new AppError("Mật khẩu xác nhận không khớp.", 400);
      }

      const result = await authService.register({ username, email, password });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
         throw new AppError("Vui lòng cung cấp email và mật khẩu", 400);
      }
      
      const result = await authService.login({ email, password });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      
      const user = await authService.getMe(req.user.id);
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
};
