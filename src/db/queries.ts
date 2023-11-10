import prisma from '@/db/prisma';
import { Game, TeamStats } from '@/db/dataTypes';

export async function getGameCount() {
  return prisma.game.count();
}

export async function createGames(games: Game[]) {
  return prisma.game.createMany({ data: games });
}

export async function updateGames(games: Game[]) {
  return prisma.$transaction(
    games.map((game) => prisma.game.upsert(
      {
        where: { apiId: game.apiId },
        update: {
          date: game.date,
          homeScore: game.homeScore,
          awayScore: game.awayScore,
          season: game.season,
          period: game.period,
          status: game.status,
          time: game.time,
          postseason: game.postseason,
          homeTeamId: game.homeTeamId,
          awayTeamId: game.awayTeamId,
          lastSync: new Date(),
        },
        create: {
          apiId: game.apiId,
          date: game.date,
          homeScore: game.homeScore,
          awayScore: game.awayScore,
          season: game.season,
          period: game.period,
          status: game.status,
          time: game.time,
          postseason: game.postseason,
          homeTeamId: game.homeTeamId,
          awayTeamId: game.awayTeamId,
          lastSync: new Date(),
        },
      },
    )),
  );
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

export async function getPool(poolName: string) {
  return prisma.seasonDraft.findMany({
    where: { winsPool: { name: poolName } },
    include: {
      winsPool: true,
      owner: true,
      teams: true,
    },
  });
}

export async function createStats(stats: Omit<TeamStats, 'id'>[]) {
  return prisma.teamSeasonStats.createMany({ data: stats });
}

export async function deleteStats(season: number) {
  return prisma.teamSeasonStats.deleteMany({
    where: { season },
  });
}

export async function getStats(season: number) {
  return prisma.teamSeasonStats.findMany({ where: { season } });
}

export async function getLastSyncTime(season: number) {
  const lastSync = await prisma.gameSyncHistory.aggregate({
    where: {
      status: { contains: 'success' },
      dateFetchEnded: { not: null },
    },
    _max: { dateFetchStarted: true },
  });
  // eslint-disable-next-line no-underscore-dangle
  if (!lastSync?._max.dateFetchStarted) return (new Date(`${season - 1}`)).valueOf();
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
      status: 'complete',
    },
  });
}
