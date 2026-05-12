import { Request, Response, NextFunction } from "express";
import { statsService } from "../services/stats.service";

export const statsController = {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await statsService.getOverview();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getRegistrationsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await statsService.getRegistrationsByDate();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
