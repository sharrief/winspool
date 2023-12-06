import API from '@/app/api/API';
import SeasonRepository from '@/db/repositories/SeasonRepository';
import SeasonStatsRepository from '@/db/repositories/SeasonStatsRepository';
import PoolRepository from '@/db/repositories/PoolRepository';
import GameRepository from '@/db/repositories/GameRepository';
import GameSyncRepository from '@/db/repositories/GameSyncRepository';
import SyncGames from '@/db/syncGames';
import fetchGames from '@/db/fetchGames';
import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';
import ERROR from '@/util/errorMessages';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import MockDate from 'mockdate';
import Options from '@/util/options';
import * as date from '@/util/date';
import { mockDBGame } from '@/db/bootstrapping/mockData';
import parseAPIGame from '@/db/bootstrapping/parseAPIGame';

jest.mock('next/navigation');

jest.mock('@/db/repositories/SeasonRepository');
jest.mock('@/db/repositories/SeasonStatsRepository');
jest.mock('@/db/repositories/PoolRepository');
jest.mock('@/db/repositories/GameRepository');
jest.mock('@/db/repositories/GameSyncRepository');
const mockedSeasonRepository = jest.mocked(SeasonRepository);
const mockedSeasonStatsRepository = jest.mocked(SeasonStatsRepository);
const mockedPoolRepository = jest.mocked(PoolRepository);
const mockedGameRepository = jest.mocked(GameRepository);
const mockedGameSyncRepository = jest.mocked(GameSyncRepository);

jest.mock('@/util/options');
const mockedOptions = jest.mocked(Options);

jest.mock('@/util/date');
const mockedDate = jest.mocked(date);

jest.mock('@/db/syncGames');
const mockedSyncGames = jest.mocked(SyncGames);

jest.mock('@/db/fetchGames');
const mockFetchGames = jest.mocked(fetchGames);

jest.mock('@/db/bootstrapping/parseAPIGame');
const mockedParseGame = jest.mocked(parseAPIGame);
mockedParseGame.mockImplementation((a) => a as any);

jest.mock('@/util/aggregateStatsByTeam');
const mockedAggregateStatsByTeam = jest.mocked(aggregateStatsByTeam);

const season = 2020;
const poolName = 'poolName';
const seasonStats = [
  {
    teamId: 1, wins: 1, losses: 1, season,
  },
  {
    teamId: 2, wins: 2, losses: 2, season,
  },
  {
    teamId: 3, wins: 3, losses: 3, season,
  },
  {
    teamId: 4, wins: 4, losses: 4, season,
  },
];

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('getSeasonMeta', () => {
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedSeasonRepository.getSeasonMeta.mockRejectedValueOnce(new Error(testError));
    await expect(API.getSeasonsMeta())
      .rejects.toThrowError(`${ERROR.API_GET_SEASON_META}: ${testError}`);
  });
  it('returns the season metadata from the repository', async () => {
    const seasonMeta = {} as any;
    mockedSeasonRepository.getSeasonMeta.mockResolvedValue(seasonMeta);
    const ret = await API.getSeasonsMeta();
    expect(ret).toBe(seasonMeta);
  });
});

describe('getGamesBySeasonAndWeek', () => {
  const params = {
    season, week: 2,
  };
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedSeasonRepository.getSchedule.mockRejectedValueOnce(new Error(testError));
    await expect(API.getGamesBySeasonAndWeek(params))
      .rejects.toThrowError(`${ERROR.API_GET_GAME_BY_SCHEDULE}: ${testError}`);
  });
  it('validates user input', async () => {
    const numberSafeParseSpy = jest.spyOn(z.ZodNumber.prototype, 'safeParse');
    await API.getGamesBySeasonAndWeek(params);
    expect(numberSafeParseSpy).toHaveBeenNthCalledWith(1, params.season);
    expect(numberSafeParseSpy).toHaveBeenNthCalledWith(2, params.week);
  });
  it('404 on invalid season number', async () => {
    const ret = await API.getGamesBySeasonAndWeek({ ...params, season: 'twenty' } as any);
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
  });
  it('404 on invalid week number', async () => {
    const ret = await API.getGamesBySeasonAndWeek({ ...params, week: 'two' } as any);
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
  });
  it('returns the array of games matching the season and week', async () => {
    const games = [] as any;
    mockedSeasonRepository.getSchedule.mockResolvedValueOnce(games);
    const ret = await API.getGamesBySeasonAndWeek(params);
    expect(ret).toBe(games);
    expect(mockedSeasonRepository.getSchedule).toHaveBeenCalledTimes(1);
    expect(mockedSeasonRepository.getSchedule)
      .toHaveBeenCalledWith(params.season, params.week);
  });
});

describe('getPoolStandings', () => {
  const params = { poolName };
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedPoolRepository.findByName.mockRejectedValueOnce(new Error(testError));
    await expect(API.getPoolStandings(params))
      .rejects.toThrowError(`${ERROR.API_GET_STANDINGS}: ${testError}`);
  });
  it('validates user input', async () => {
    const paramsSafeParseSpy = jest.spyOn(z.ZodObject.prototype, 'safeParse');
    await API.getPoolStandings(params);
    expect(paramsSafeParseSpy).toHaveBeenNthCalledWith(1, params);
  });
  it('404 on invalid pool name', async () => {
    const ret = await API.getPoolStandings({ poolName: {} } as any);
    expect(mockedPoolRepository.findByName).not.toHaveBeenCalled();
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
  });
  it('404 on pool not found', async () => {
    mockedPoolRepository.findByName.mockResolvedValueOnce(null);
    const ret = await API.getPoolStandings(params);
    expect(mockedPoolRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockedPoolRepository.findByName).toHaveBeenCalledWith(params.poolName);
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
  });
  it('aggregates and returns the pool standings', async () => {
    const pool = { season, name: poolName } as any;
    mockedPoolRepository.findByName.mockResolvedValueOnce(pool);
    mockedSeasonStatsRepository.findMany.mockResolvedValueOnce(seasonStats as any);
    const draftPicks = [
      { owner: {}, teams: [{ id: 1 }, { id: 4 }] },
      { owner: {}, teams: [{ id: 2 }] },
      { owner: {}, teams: [{ id: 3 }] },
    ] as any;
    mockedPoolRepository.getDraftPicks.mockResolvedValueOnce(draftPicks);
    const teams = seasonStats.map((t) => ({
      id: t.teamId,
      wins: t.wins,
      losses: t.losses,
    }));
    const expected = [
      {
        ...draftPicks[0].owner,
        wins: teams[0].wins + teams[3].wins,
        losses: teams[0].losses + teams[3].losses,
        teams: [
          teams[0],
          teams[3],
        ],
        rank: 1,
      },
      {
        ...draftPicks[2].owner,
        wins: teams[2].wins,
        losses: teams[2].losses,
        teams: [teams[2]],
        rank: 2,
      },
      {
        ...draftPicks[1].owner,
        wins: teams[1].wins,
        losses: teams[1].losses,
        teams: [teams[1]],
        rank: 3,
      },
    ];
    const ret = await API.getPoolStandings(params);
    expect(ret).toEqual(expected);
  });
});

describe('updateGamesAndStats', () => {
  const params = { season };
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedSyncGames.mockRejectedValueOnce(new Error(testError));
    await expect(API.updateGamesAndStats(params))
      .rejects.toThrowError(ERROR.API_UPDATE_GAMES_STATS);
  });
  it('validates user input', async () => {
    const paramsSafeParseSpy = jest.spyOn(z.ZodObject.prototype, 'safeParse');
    await API.updateGamesAndStats(params);
    expect(paramsSafeParseSpy).toHaveBeenCalledWith(params);
  });
  it('404 on invalid season', async () => {
    const ret = await API.updateGamesAndStats({ season: 'invalid' } as any);
    expect(mockedSyncGames).not.toHaveBeenCalled();
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
  });
  it('no-ops if the games aren\'t updated', async () => {
    // Arrange
    mockedSyncGames.mockResolvedValueOnce(false);
    // Act
    await API.updateGamesAndStats(params);
    // Assert
    expect(mockedGameRepository.findBySeason).not.toHaveBeenCalled();
    expect(mockedAggregateStatsByTeam).not.toHaveBeenCalled();
    expect(mockedSeasonStatsRepository.deleteStats).not.toHaveBeenCalled();
    expect(mockedSeasonStatsRepository.createStats).not.toHaveBeenCalled();
  });
  it('saves the updated games and stats to the database', async () => {
    // Arrange
    mockedSyncGames.mockResolvedValueOnce(true);
    const games = [] as any;
    mockedGameRepository.findBySeason.mockResolvedValueOnce(games);
    const statsByTeam = new Map([
      [1, seasonStats[0]],
      [2, seasonStats[1]],
      [3, seasonStats[2]],
      [4, seasonStats[3]],
    ]);
    mockedAggregateStatsByTeam.mockReturnValueOnce(statsByTeam);
    // Act
    const ret = await API.updateGamesAndStats(params);
    // Assert
    expect(mockedSyncGames).toHaveBeenCalledWith(params.season);
    expect(mockedAggregateStatsByTeam).toHaveBeenCalledWith(games);
    expect(mockedSeasonStatsRepository.deleteStats).toHaveBeenCalledTimes(1);
    expect(mockedSeasonStatsRepository.createStats).toHaveBeenCalledTimes(1);
    expect(mockedSeasonStatsRepository.createStats).toHaveBeenCalledWith(
      expect.arrayContaining(seasonStats.map((t) => expect.objectContaining({ ...t, score: 0 }))),
    );
    expect(ret).toBe(true);
  });
});

describe('getLatestRegularSeasonWeek', () => {
  const params = { season };
  const invalidParams = { season: 1.23 };
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedSyncGames.mockRejectedValueOnce(new Error(testError));
    await expect(API.getLatestRegularSeasonWeek(params))
      .rejects.toThrowError(ERROR.API_GET_LATEST_WEEK);
  });
  it('validates user input', async () => {
    const paramsSafeParseSpy = jest.spyOn(z.ZodObject.prototype, 'safeParse');
    await API.getLatestRegularSeasonWeek(invalidParams);
    expect(paramsSafeParseSpy).toHaveBeenCalledWith(invalidParams);
  });
  it('404 on invalid input', async () => {
    const ret = await API.getLatestRegularSeasonWeek(invalidParams);
    expect(notFound).toHaveBeenCalled();
    expect(ret).toBeUndefined();
    expect(mockedSeasonRepository.getSeasonMeta).not.toHaveBeenCalled();
  });
  it.each([
    // label, season start, season end, now, expected week number
    // weeks always start on Mondays in Luxon
    ['for the start of the season', '2020-01-01', '2020-07-31', '2020-01-01', 1],
    ['near the start of the season', '2020-01-01', '2020-07-31', '2020-01-07', 2],
    ['for the end of the season', '2020-01-01', '2020-07-31', '2020-07-31', 31],
    ['near the end of the season', '2020-01-01', '2020-07-31', '2020-07-26', 30],
    ['for past seasons', '2020-01-01', '2020-07-31', '2020-08-30', 31],
    ['for the current season', '2020-01-01', '2020-07-31', '2020-06-02', 23],
  ])('returns the latest season week %s', async (_, start, end, now, expected) => {
    const seasonStart = new Date(start);
    const seasonEnd = new Date(end);
    mockedSeasonRepository.getSeasonMeta.mockResolvedValueOnce({
      regularSeasonEnd: seasonEnd,
      regularSeasonStart: seasonStart,
      season,
      id: 1,
    });
    MockDate.set(now);
    const week = await API.getLatestRegularSeasonWeek(params);
    expect(week).toBe(expected);
    MockDate.reset();
  });
});

describe('syncSeasonGames', () => {
  const params = { season: 2020 };
  it('Logs errors', async () => {
    const testError = 'Test error';
    mockedGameSyncRepository.getSyncInProgress.mockRejectedValueOnce(new Error(testError));
    await expect(API.syncSeasonGames(params))
      .rejects.toThrowError(ERROR.API_SYNC_GAMES);
  });
  it('doesn\'t sync if a sync is in progress', async () => {
    // Arrange
    mockedGameSyncRepository.getSyncInProgress.mockResolvedValueOnce(true as any);
    // Act
    const didSync = await API.syncSeasonGames(params);
    // Assert
    expect(didSync).toBe(false);
    expect(GameSyncRepository.getSyncInProgress).toHaveBeenCalled();
    expect(GameSyncRepository.getLastSyncTime).not.toHaveBeenCalled();
    expect(GameSyncRepository.startGameSync).not.toHaveBeenCalled();
    expect(GameRepository.updateMany).not.toHaveBeenCalled();
  });
  it('doesn\'t sync if a sync was done too recently', async () => {
    // Arrange
    mockedGameSyncRepository.getSyncInProgress.mockImplementation(async () => false as any);
    /* Last sync was half a min ago, too soon to sync */
    mockedOptions.MINUTES_BETWEEN_SYNCS = 1;
    mockedDate.getNowInMs
      .mockReturnValueOnce(Options.MINUTES_BETWEEN_SYNCS * 1000);
    mockedGameSyncRepository.getLastSyncTime
      .mockResolvedValueOnce(Options.MINUTES_BETWEEN_SYNCS * 500);
    // Act
    const didSync = await API.syncSeasonGames(params);
    // Assert
    expect(GameSyncRepository.getSyncInProgress).toHaveBeenCalled();
    expect(GameSyncRepository.getLastSyncTime).toHaveBeenCalled();
    expect(GameSyncRepository.startGameSync).not.toHaveBeenCalled();
    expect(GameRepository.updateMany).not.toHaveBeenCalled();
    expect(didSync).toBe(false);
  });
});
describe('when the last sync', () => {
  const params = { season: 2020 };
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
    ['is more recent than yesterday, sync games starting after yesterday', valueOfLastSyncAfterYesterday],
    ['is older than yesterday, sync games starting after last sync', valueOfLastSyncBeforeYesterday],
  ])('%s', async (_, lastSyncTime) => {
    // Arrange
    mockedOptions.MINUTES_BETWEEN_SYNCS = minuteSyncDelay;
    mockedGameSyncRepository.getSyncInProgress.mockResolvedValueOnce(false as any);
    mockedGameSyncRepository.startGameSync.mockResolvedValueOnce({ id: 1 } as any);
    mockedGameSyncRepository.getLastSyncTime.mockResolvedValueOnce(lastSyncTime);
    mockedDate.getNowInMs
      .mockReturnValueOnce(valueOfNow);
    mockedDate.getYesterdayInMs
      .mockReturnValueOnce(valueOfYesterday);
    mockFetchGames.mockImplementation(async function* fetchGamesGen() {
      yield [mockDBGame as any];
      yield [{ ...mockDBGame, id: 2 } as any];
    });
    // Act
    const didSync = await API.syncSeasonGames(params);
    // Assert
    expect(mockFetchGames).toHaveBeenCalledWith(
      params.season,
      /* Sync should start from earlier of yesterday or lastSync */
      Math.min(lastSyncTime, valueOfYesterday),
      valueOfNow,
    );
    expect(GameRepository.updateMany).toHaveBeenNthCalledWith(
      1,
      expect.arrayContaining([expect.objectContaining(mockDBGame)]),
    );
    expect(GameRepository.updateMany).toHaveBeenNthCalledWith(
      2,
      expect.arrayContaining([expect.objectContaining({ ...mockDBGame, id: 2 })]),
    );
    expect(didSync).toBe(true);
  });
});
