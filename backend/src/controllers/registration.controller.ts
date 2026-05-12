import { Request, Response, NextFunction } from "express";
import { registrationService } from "../services/registration.service";
import { AppError } from "../middlewares/error.middleware";

export const registrationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      const result = await registrationService.createRegistration(req.user.id, req.body);
      res.status(201).json({ success: true, data: result, message: "Đăng ký thành công" });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await registrationService.getAllRegistrations(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getMy(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      const result = await registrationService.getMyRegistrations(req.user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await registrationService.approveRegistration(id);
      res.json({ success: true, data: result, message: "Đã duyệt đơn đăng ký" });
    } catch (error) {
      next(error);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { note } = req.body;
      const result = await registrationService.rejectRegistration(id, note);
      res.json({ success: true, data: result, message: "Đã từ chối đơn đăng ký" });
    } catch (error) {
      next(error);
    }
  }
};
