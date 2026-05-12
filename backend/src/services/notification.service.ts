import prisma from "../config/prisma";

export const notificationService = {
  async createNotification(userId: string, title: string, message: string, type: string = "SYSTEM") {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
        },
      });
    } catch (error) {
      console.error("Lỗi tạo notification:", error);
    }
  }
};
