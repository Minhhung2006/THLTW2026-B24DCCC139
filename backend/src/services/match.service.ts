import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMatchesByTournament = async (tournamentId: string) => {
  return await prisma.match.findMany({
    where: { tournamentId },
    include: {
      team1: true,
      team2: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createMatch = async (data: { tournamentId: string; team1Id: string; team2Id: string; round?: string; startTime?: Date }) => {
  return await prisma.match.create({
    data: {
      tournamentId: data.tournamentId,
      team1Id: data.team1Id,
      team2Id: data.team2Id,
      round: data.round,
      startTime: data.startTime ? new Date(data.startTime) : null,
      status: 'PENDING',
    },
    include: {
      team1: true,
      team2: true,
    }
  });
};

export const updateMatchScore = async (id: string, data: { team1Score?: number; team2Score?: number; status?: string }) => {
  return await prisma.match.update({
    where: { id },
    data,
    include: {
      team1: true,
      team2: true,
    }
  });
};
