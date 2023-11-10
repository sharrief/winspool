import { mockDBGame } from '@/db/bootstrapping/mockData';
import fetchGames from '@/db/fetchGames';
import * as queries from '@/db/queries';
import SyncGames from '@/db/syncGames';
import * as date from '@/util/date';
import Options from '@/util/options';

jest.mock('@/db/bootstrapping/parseGame', () => jest.fn((g) => g));
jest.mock('@/db/fetchGames', () => jest.fn(function* fetchGamesGen() {
  yield [mockDBGame];
  yield [{ ...mockDBGame, id: 2 }];
}));
const mockFetchGames = jest.mocked(fetchGames);

jest.mock('@/db/queries');
const mockedQueries = jest.mocked(queries);
mockedQueries.startGameSync.mockResolvedValue({ id: 1 } as any);

jest.mock('@/util/date');
const mockedDate = jest.mocked(date);

jest.mock('@/util/options');
const mockedOptions = jest.mocked(Options);

afterEach(() => {
  mockedQueries.getSyncInProgress.mockReset();
  mockedQueries.getLastSyncTime.mockReset();
});

describe('syncGames', () => {
  it('doesn\'t sync if a sync is in progress', async () => {
    // Arrange
    mockedQueries.getSyncInProgress.mockResolvedValueOnce(true as any);
    // Act
    const didSync = await SyncGames(2022);
    // Assert
    expect(didSync).toBe(false);
    expect(queries.getSyncInProgress).toHaveBeenCalled();
    expect(queries.getLastSyncTime).not.toHaveBeenCalled();
    expect(queries.startGameSync).not.toHaveBeenCalled();
    expect(queries.updateGames).not.toHaveBeenCalled();
  });
  it('doesn\'t sync if a sync was done too recently', async () => {
    // Arrange
    mockedQueries.getSyncInProgress.mockResolvedValueOnce(false as any);
    /* Last sync was half a min ago, too soon to sync */
    mockedOptions.MINUTES_BETWEEN_SYNCS = 1;
    mockedDate.getNowInMs
      .mockReturnValueOnce(Options.MINUTES_BETWEEN_SYNCS * 1000);
    mockedQueries.getLastSyncTime
      .mockResolvedValueOnce(Options.MINUTES_BETWEEN_SYNCS * 500);
    // Act
    const didSync = await SyncGames(2022);
    // Assert
    expect(queries.getSyncInProgress).toHaveBeenCalled();
    expect(queries.getLastSyncTime).toHaveBeenCalled();
    expect(queries.startGameSync).not.toHaveBeenCalled();
    expect(queries.updateGames).not.toHaveBeenCalled();
    expect(didSync).toBe(false);
  });
  describe('when the last sync', () => {
    /*
      This test checks code paths for when
      lastSync was before yesterday
      & lastSync was more recent than yesterday
    */
    const valueOfNow = 10000;
    /* With a syncDelay of 1000ms,
    as long as both lastSync and yesterday
    are 1000ms less than now, sync will happen */
    const minuteSyncDelay = 1;
    /* yesterday was 5 minutes ago */
    const valueOfYesterday = valueOfNow - 5000 * minuteSyncDelay;
    /* last sync was 1 min before start of yesterday */
    const valueOfLastSyncBeforeYesterday = valueOfYesterday - 1000;
    /* last sync was 1 min after start of yesterday */
    const valueOfLastSyncAfterYesterday = valueOfYesterday + 1000;
    it.each([
      ['is older than yesterday, sync games starting after last sync', valueOfLastSyncBeforeYesterday],
      ['is more recent than yesterday, sync games starting after yesterday', valueOfLastSyncAfterYesterday],
    ])('%s', async (_, lastSyncTime) => {
      // Arrange
      mockedOptions.MINUTES_BETWEEN_SYNCS = minuteSyncDelay;
      mockedQueries.getSyncInProgress.mockResolvedValueOnce(false as any);
      mockedQueries.getLastSyncTime.mockResolvedValueOnce(lastSyncTime);
      mockedDate.getNowInMs
        .mockReturnValueOnce(valueOfNow);
      mockedDate.getYesterdayInMs
        .mockReturnValueOnce(valueOfYesterday);
      // Act
      const didSync = await SyncGames(2022);
      // Assert
      expect(mockFetchGames).toHaveBeenCalledWith(
        2022,
        /* Sync should start from earlier of yesterday or lastSync */
        Math.min(lastSyncTime, valueOfYesterday),
        valueOfNow,
      );
      expect(queries.updateGames).toHaveBeenNthCalledWith(
        1,
        expect.arrayContaining([expect.objectContaining(mockDBGame)]),
      );
      expect(queries.updateGames).toHaveBeenNthCalledWith(
        2,
        expect.arrayContaining([expect.objectContaining({ ...mockDBGame, id: 2 })]),
      );
      expect(didSync).toBe(true);
    });
  });
});
