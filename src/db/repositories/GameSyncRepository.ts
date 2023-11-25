import { GameSyncHistory } from '@/db/dataTypes';
import prisma from '@/db/prisma';
import SeasonRepository from '@/db/repositories/SeasonRepository';
import LogError from '@/util/decorators/LogError';
import ERROR from '@/util/errorMessages';

export default class GameSyncRepository {
  /**
   *
   * @param season The season to get sync history for
   * @returns The timestamp the last successful sync was started
   */
  @LogError(ERROR.SYNC_GET_LAST)
  static async getLastSyncTime(season: number): Promise<number> {
    const lastSync = await prisma.gameSyncHistory.aggregate({
      where: {
        season,
        status: { contains: 'success' },
        dateFetchEnded: { not: null },
      },
      _max: { dateFetchStarted: true },
    });
    //* If no previous sync exists, return the timestamp for the start of the season
    // eslint-disable-next-line no-underscore-dangle
    if (!lastSync?._max.dateFetchStarted) {
      const { regularSeasonStart } = await SeasonRepository.getSeasonMeta(season);
      return regularSeasonStart.valueOf();
    }

    //* Return the timestamp of the start of the last sync
    // eslint-disable-next-line no-underscore-dangle
    return lastSync?._max.dateFetchStarted.valueOf();
  }

  @LogError(ERROR.SYNC_IN_PROGRESS)
  static async getSyncInProgress(season: number): Promise<GameSyncHistory | null> {
    const result = await prisma.gameSyncHistory.findFirst({
      where: {
        dateFetchEnded: null,
        season,
      },
    });
    if (!result) return null;
    return result;
  }

  @LogError(ERROR.SYNC_START)
  static async startGameSync(now: number, season: number) {
    return prisma.gameSyncHistory.create({
      data: {
        season,
        dateFetchStarted: new Date(now),
        dateFetchEnded: null,
        latestDayFinalized: null,
        status: 'syncing',
      },
    });
  }

  @LogError(ERROR.SYNC_COMPLETE)
  static async completeGameSync(id: number, time: number, gameIds: number[]) {
    return prisma.gameSyncHistory.update({
      where: { id },
      data: {
        dateFetchEnded: new Date(time),
        gamesUpdatedApiIds: gameIds,
        status: 'complete',
      },
    });
  }
}
