import type { GameSyncHistory } from '@/db/dataTypes';
import type GameSyncRepository from '@/db/repositories/GameSyncRepository';

const mockSync: GameSyncHistory = {
  id: 1,
  dateFetchStarted: new Date(),
  dateFetchEnded: new Date(),
  status: '',
  season: 0,
  latestDayFinalized: new Date(),
  gamesUpdatedApiIds: [],
};
export default class MockGameSyncRepository implements GameSyncRepository {
  /**
   *
   * @param season The season to get sync history for
   * @returns The timestamp the last successful sync was started
   */
  static getLastSyncTime = jest.fn(async () => (new Date()).valueOf());

  static getSyncInProgress = jest.fn(async () => mockSync);

  static startGameSync = jest.fn(async () => (mockSync));

  static completeGameSync = jest.fn(async () => null);
}
