import prisma from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import { RegistrationStatus, TournamentStatus } from "@prisma/client";
import { notificationService } from "./notification.service";
import { emailService } from "./email.service";

interface MemberInput {
  memberName: string;
  gameId: string;
}

interface CreateRegistrationDto {
  tournamentId: string;
  teamName: string;
  teamLogo?: string;
  members: MemberInput[];
}

export const registrationService = {
  async createRegistration(userId: string, data: CreateRegistrationDto) {
    const { tournamentId, teamName, teamLogo, members } = data;

    // 1. Kiểm tra tournament tồn tại và UPCOMING
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: { registrations: { where: { status: RegistrationStatus.APPROVED } } }
        }
      }
    });

    if (!tournament) throw new AppError("Không tìm thấy giải đấu", 404);
    if (tournament.status !== TournamentStatus.UPCOMING) {
      throw new AppError("Giải đấu không ở trạng thái sắp diễn ra (UPCOMING)", 400);
    }

    // 2. Kiểm tra maxTeams
    if (tournament._count.registrations >= tournament.maxTeams) {
      throw new AppError("Giải đấu đã đủ số lượng đội", 400);
    }

    // 3. Kiểm tra user đã đăng ký chưa
    const existingReg = await prisma.registration.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } }
    });
    if (existingReg) {
      throw new AppError("Bạn đã nộp đơn đăng ký cho giải đấu này rồi", 400);
    }

    // 4. Prisma Transaction
    const registration = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          tournamentId,
          userId,
          teamName,
          teamLogo,
          status: RegistrationStatus.PENDING,
          members: {
            create: members.map(m => ({ memberName: m.memberName, gameId: m.gameId }))
          }
        },
        include: { members: true }
      });

      // Notification cho người đăng ký
      await tx.notification.create({
        data: {
          userId,
          title: "Đăng ký thành công",
          message: `Bạn đã nộp đơn đăng ký cho đội ${teamName} tham gia giải đấu. Vui lòng chờ duyệt.`,
          type: "REGISTRATION_UPDATE"
        }
      });

      // Notification cho Admin (người tạo giải)
      await tx.notification.create({
        data: {
          userId: tournament.createdById,
          title: "Có đội mới đăng ký",
          message: `Đội ${teamName} vừa nộp đơn đăng ký tham gia giải đấu.`,
          type: "SYSTEM"
        }
      });

      return reg;
    });

    return registration;
  },

  async getAllRegistrations(query: any) {
    const { tournamentId, status, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (tournamentId) where.tournamentId = tournamentId;
    if (status) where.status = status as RegistrationStatus;

    const [total, data] = await Promise.all([
      prisma.registration.count({ where }),
      prisma.registration.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, username: true, email: true } },
          tournament: { select: { id: true, name: true, game: true } },
          members: true
        },
        orderBy: { createdAt: "desc" },
      })
    ]);

    return { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)), data };
  },

  async getMyRegistrations(userId: string) {
    return prisma.registration.findMany({
      where: { userId },
      include: {
        tournament: { select: { id: true, name: true, game: true, status: true, startDate: true } },
        members: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async approveRegistration(id: string) {
    const reg = await prisma.registration.findUnique({ where: { id }, include: { user: true, tournament: true } });
    if (!reg) throw new AppError("Không tìm thấy đơn đăng ký", 404);
    if (reg.status !== RegistrationStatus.PENDING) throw new AppError("Đơn đăng ký không ở trạng thái chờ duyệt", 400);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReg = await tx.registration.update({
        where: { id },
        data: { status: RegistrationStatus.APPROVED }
      });

      // Tạo notification
      await tx.notification.create({
        data: {
          userId: reg.userId,
          title: "Đơn đăng ký được duyệt",
          message: `Đơn đăng ký đội ${reg.teamName} cho giải ${reg.tournament.name} đã được DUYỆT.`,
          type: "REGISTRATION_UPDATE"
        }
      });

      return updatedReg;
    });

    // Gửi email không chặn transaction
    await emailService.sendRegistrationEmail(reg.user.email, "APPROVED");

    return updated;
  },

  async rejectRegistration(id: string, note: string) {
    if (!note) throw new AppError("Vui lòng cung cấp lý do từ chối (note)", 400);

    const reg = await prisma.registration.findUnique({ where: { id }, include: { user: true, tournament: true } });
    if (!reg) throw new AppError("Không tìm thấy đơn đăng ký", 404);
    if (reg.status !== RegistrationStatus.PENDING) throw new AppError("Đơn đăng ký không ở trạng thái chờ duyệt", 400);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedReg = await tx.registration.update({
        where: { id },
        data: { status: RegistrationStatus.REJECTED, note }
      });

      await tx.notification.create({
        data: {
          userId: reg.userId,
          title: "Đơn đăng ký bị từ chối",
          message: `Đơn đăng ký đội ${reg.teamName} cho giải ${reg.tournament.name} đã bị TỪ CHỐI. Lý do: ${note}`,
          type: "REGISTRATION_UPDATE"
        }
      });

      return updatedReg;
    });

    await emailService.sendRegistrationEmail(reg.user.email, "REJECTED", note);

    return updated;
  }
};
