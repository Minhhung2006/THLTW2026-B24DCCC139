import prisma from "../config/prisma";
import { Role } from "@prisma/client";

export const statsService = {
  async getOverview() {
    const [totalTournaments, registrationStats, totalUsers, topTournaments] = await Promise.all([
      prisma.tournament.count(),
      prisma.registration.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.user.count({
        where: { role: Role.USER }
      }),
      prisma.tournament.findMany({
        take: 5,
        orderBy: {
          registrations: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      })
    ]);

    return {
      totalTournaments,
      registrationStats,
      totalUsers,
      topTournaments
    };
  },

  async getRegistrationsByDate() {
    const data = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    
    // Convert BigInt to Number for JSON serialization
    const formattedData = (data as any[]).map(row => ({
      date: row.date,
      count: Number(row.count)
    }));

    return formattedData;
  }
};
