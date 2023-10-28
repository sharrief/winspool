import prisma from "@/db/prisma";
import { Game, TeamStats } from "@/db/dataTypes";

export async function getGameCount() {
  return prisma.game.count();
}

export async function createGames(games: Game[]) {
  return prisma.game.createMany({ data: games });
}

export async function getGamesByTeamIds(ids: number[], season?: number) {
  const whereSeason = season ? { season } : {};
  return prisma.game.findMany({
    where: {
      OR: [{ homeTeamId: { in: ids } }, { awayTeamId: { in: ids } }],
      ...whereSeason
    }
  })
}

export async function getTeams() {
  return prisma.team.findMany();
}

export async function createStats(stats: Omit<TeamStats, 'id'>[]) {
  return await prisma.teamSeasonStats.createMany({ data: stats })
}
