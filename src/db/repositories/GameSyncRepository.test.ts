import MockDate from 'mockdate';
import prisma from '@/db/prisma';
import GameSyncRepository from '@/db/repositories/GameSyncRepository';
import SeasonRepository from '@/db/repositories/SeasonRepository';
import ERROR from '@/util/errorMessages';

const prismaMockedAggregateSpy = jest.spyOn(prisma.gameSyncHistory, 'aggregate')
  .mockImplementation(jest.fn());
const prismaFindFirstSpy = jest.spyOn(prisma.gameSyncHistory, 'findFirst')
  .mockImplementation(jest.fn());
const prismaCreateSpy = jest.spyOn(prisma.gameSyncHistory, 'create')
  .mockImplementation(jest.fn());
const prismaUpdateSpy = jest.spyOn(prisma.gameSyncHistory, 'update')
  .mockImplementation(jest.fn());

const season = 2020;
const regularSeasonStart = new Date('2020-01-01');
const regularSeasonEnd = new Date('2020-12-31');
const getSeasonMetaSpy = jest.spyOn(SeasonRepository, 'getSeasonMeta');

beforeAll(() => {
  MockDate.set('2023-11-16');
});

beforeEach(() => {
  getSeasonMetaSpy.mockImplementation(() => ({
    id: 1,
    season,
    regularSeasonStart,
    regularSeasonEnd,
  }) as any);
});

afterEach(() => {
  prismaMockedAggregateSpy.mockReset();
  prismaFindFirstSpy.mockReset();
  prismaCreateSpy.mockReset();
  prismaUpdateSpy.mockReset();
  getSeasonMetaSpy.mockReset();
});

afterAll(() => {
  MockDate.reset();
});

describe('getLastSyncTime', () => {
  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaMockedAggregateSpy.mockRejectedValueOnce(new Error(testError));
    await expect(GameSyncRepository.getLastSyncTime(season))
      .rejects.toThrowError(ERROR.SYNC_GET_LAST);
  });
  it('Returns the start of the season timestamp if no sync exists for the season', async () => {
    const result = await GameSyncRepository.getLastSyncTime(season);
    expect(result).toBe(regularSeasonStart.valueOf());
  });
  it('Returns the timestamp of the last sync', async () => {
    const lastSyncDate = new Date('2020-06-01');
    prismaMockedAggregateSpy.mockResolvedValue({ _max: { dateFetchStarted: lastSyncDate } } as any);
    const result = await GameSyncRepository.getLastSyncTime(season);
    expect(result).toEqual(lastSyncDate.valueOf());
    // TODO Use test database for mocking the sync data
    expect(prismaMockedAggregateSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        season,
        status: expect.objectContaining({ contains: 'success' }),
        dateFetchEnded: expect.objectContaining({ not: null }),
      }),
      _max: expect.objectContaining({ dateFetchStarted: true }),
    }));
  });
});

describe('getSyncInProgress', () => {
  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaFindFirstSpy.mockRejectedValueOnce(new Error(testError));
    await expect(GameSyncRepository.getSyncInProgress(season))
      .rejects.toThrowError(ERROR.SYNC_IN_PROGRESS);
  });
  it('returns null if no game sync exists', async () => {
    const ret = await GameSyncRepository.getSyncInProgress(2020);
    expect(ret).toBeNull();
  });
  it('returns the game sync item from the db', async () => {
    const item = {} as any;
    prismaFindFirstSpy.mockImplementationOnce(() => item);
    const ret = await GameSyncRepository.getSyncInProgress(2020);
    expect(ret).toBe(item);
  });
});

describe('startGameSync', () => {
  it('Logs errors', async () => {
    const testError = 'Test error';
    const now = (new Date()).valueOf();
    prismaCreateSpy.mockRejectedValueOnce(new Error(testError));
    await expect(GameSyncRepository.startGameSync(now, season))
      .rejects.toThrowError(ERROR.SYNC_START);
  });
  it('creates a game sync record in the db', async () => {
    const now = (new Date()).valueOf();
    await GameSyncRepository.startGameSync(now, season);
    expect(prismaCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          season,
          dateFetchStarted: new Date(now),
          dateFetchEnded: null,
          latestDayFinalized: null,
          status: 'syncing',
        }),
      }),
    );
  });
});

describe('completeGameSync', () => {
  const id = 1;
  const time = (new Date()).valueOf();
  const gameIds = [1, 2, 3];
  it('Logs errors', async () => {
    const testError = 'Test error';
    prismaUpdateSpy.mockRejectedValueOnce(new Error(testError));
    await expect(GameSyncRepository.completeGameSync(id, time, gameIds))
      .rejects.toThrowError(ERROR.SYNC_COMPLETE);
  });
  it('marks a game sync record as complete', async () => {
    await GameSyncRepository.completeGameSync(id, time, gameIds);
    expect(prismaUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id }),
      data: expect.objectContaining({
        dateFetchEnded: new Date(time),
        gamesUpdatedApiIds: gameIds,
        status: 'complete',
      }),
    }));
  });
});
