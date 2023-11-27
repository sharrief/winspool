import type { GameSyncHistory } from '@/db/dataTypes';
import type GameSyncRepository from '@/db/repositories/GameSyncRepository';

export default class MockGameSyncRepository implements GameSyncRepository {
  static mockSync: GameSyncHistory = {
    id: 1,
    dateFetchStarted: new Date(),
    dateFetchEnded: new Date(),
    status: '',
    season: 0,
    latestDayFinalized: new Date(),
    gamesUpdatedApiIds: [],
  };

  /**
   *
   * @param season The season to get sync history for
   * @returns The timestamp the last successful sync was started
   */
  static getLastSyncTime = jest.fn(async () => (new Date()).valueOf());

  static getSyncInProgress = jest.fn(async () => MockGameSyncRepository.mockSync);

  static startGameSync = jest.fn(async () => (MockGameSyncRepository.mockSync));

  static completeGameSync = jest.fn(async () => null);
}
