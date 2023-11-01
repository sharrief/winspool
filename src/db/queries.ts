import prisma from '@/db/prisma';
import { Game, TeamStats } from '@/db/dataTypes';

export async function getGameCount() {
  return prisma.game.count();
}

export async function createGames(games: Game[]) {
  return prisma.game.createMany({ data: games });
}

export async function updateGames(games: Game[]) {
  return prisma.game.updateMany({ data: games });
}

export async function getGamesByTeamIds(ids: number[], season?: number) {
  const whereSeason = season ? { season } : {};
  return prisma.game.findMany({
    where: {
      OR: [{ homeTeamId: { in: ids } }, { awayTeamId: { in: ids } }],
      ...whereSeason,
    },
  });
}

export async function getTeams() {
  return prisma.team.findMany();
}

export async function createStats(stats: Omit<TeamStats, 'id'>[]) {
  return prisma.teamSeasonStats.createMany({ data: stats });
}

export async function getLastSyncTime() {
  const lastSync = await prisma.gameSyncHistory.aggregate({
    where: {
      status: { contains: 'success' },
      dateFetchEnded: { not: null },
    },
    _max: { dateFetchStarted: true },
  });
  // eslint-disable-next-line no-underscore-dangle
  return lastSync?._max.dateFetchStarted?.valueOf();
}

export async function getSyncInProgress() {
  return prisma.gameSyncHistory.findFirst({
    where: {
      dateFetchEnded: null,
    },
  });
}

export async function startGameSync(now: number) {
  return prisma.gameSyncHistory.create({
    data: {
      dateFetchStarted: new Date(now),
      dateFetchEnded: null,
      latestDayFinalized: null,
      status: 'syncing',
    },
  });
}

export async function completeGameSync(id: number, time: number, gameIds: number[]) {
  return prisma.gameSyncHistory.update({
    where: { id },
    data: {
      dateFetchEnded: new Date(time),
      gamesUpdatedApiIds: gameIds,
    },
  });
}
