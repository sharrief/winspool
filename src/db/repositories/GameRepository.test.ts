import MockDate from 'mockdate';
import { mockDBGame } from '@/db/bootstrapping/mockData';
import prisma from '@/db/prisma';
import GameRepository from '@/db/repositories/GameRepository';
import logger from '@/util/logger';
import ERROR from '@/util/errorMessages';

jest.mock('@/util/logger');
const mockLogger = jest.mocked(logger);

const parseGameSpy = jest.spyOn(GameRepository, 'parseGame');

describe('count', () => {
  const gameCount = 15;
  const countSpy = jest.spyOn(prisma.game, 'count')
    .mockResolvedValue(gameCount);
  afterEach(() => countSpy.mockReset());

  it('returns the number of games in the db', async () => {
    const answer = await GameRepository.count();
    expect(countSpy).toHaveBeenCalledTimes(1);
    expect(answer).toBe(gameCount);
  });

  it('Logs errors', async () => {
    const err = 'Test Error';
    const errorPrefix = ERROR.GAME_COUNT;
    countSpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.count()).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});

describe('createMany', () => {
  const games = [mockDBGame, { ...mockDBGame, id: 2 }, { ...mockDBGame, id: 3 }];
  const prismaCreateManySpy = jest.spyOn(prisma.game, 'createMany');
  afterEach(() => {
    prismaCreateManySpy.mockReset();
    parseGameSpy.mockReset();
  });

  it('no-op if games is empty', async () => {
    await GameRepository.createMany([]);
    expect(prismaCreateManySpy).not.toHaveBeenCalled();
  });

  it('validates and saves the games', async () => {
    parseGameSpy.mockImplementation((g) => g.id);
    await GameRepository.createMany(games);
    expect(parseGameSpy).toHaveBeenCalledTimes(3);
    expect(parseGameSpy).toHaveBeenNthCalledWith(1, expect.objectContaining(games[0]));
    expect(parseGameSpy).toHaveBeenNthCalledWith(2, expect.objectContaining(games[1]));
    expect(parseGameSpy).toHaveBeenNthCalledWith(3, expect.objectContaining(games[2]));
    expect(prismaCreateManySpy).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.arrayContaining([
        games[0].id,
        games[1].id,
        games[2].id,
      ]),
    }));
  });

  it('Logs errors', async () => {
    const err = 'Test Error';
    const errorPrefix = ERROR.GAME_CREATE_MANY;
    prismaCreateManySpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.createMany(games)).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});

describe('updateMany', () => {
  const prismaUpsertSpy = jest.spyOn(prisma.game, 'upsert');
  jest.spyOn(prisma, '$transaction').mockImplementation(jest.fn());
  const games = [mockDBGame, { ...mockDBGame, id: 2 }, { ...mockDBGame, id: 3 }];

  beforeAll(() => {
    parseGameSpy.mockImplementation((g) => g);
    MockDate.set('2023-11-16');
  });

  afterEach(() => {
    prismaUpsertSpy.mockReset();
  });

  afterAll(() => {
    MockDate.reset();
    parseGameSpy.mockReset();
  });

  it('no-op if games is empty', async () => {
    await GameRepository.updateMany([]);
    expect(prismaUpsertSpy).not.toHaveBeenCalled();
  });

  it('validates games before saving', async () => {
    await GameRepository.updateMany(games);
    expect(parseGameSpy).toHaveBeenCalledTimes(3);
    expect(parseGameSpy).toHaveBeenNthCalledWith(1, expect.objectContaining(games[0]));
    expect(parseGameSpy).toHaveBeenNthCalledWith(2, expect.objectContaining(games[1]));
    expect(parseGameSpy).toHaveBeenNthCalledWith(3, expect.objectContaining(games[2]));
    const { id, apiId, ...game } = games[0];
    expect(prismaUpsertSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ apiId }),
      update: expect.objectContaining({ ...game, lastSync: new Date() }),
      create: expect.objectContaining({ ...game, apiId, lastSync: new Date() }),
    }));
  });

  it('calls upsert with the provided games', async () => {
    await GameRepository.updateMany(games);
    expect(prismaUpsertSpy).toHaveBeenCalledTimes(3);
    const { id, apiId, ...game } = games[0];
    expect(prismaUpsertSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ apiId: id }),
      update: expect.objectContaining({ ...game, lastSync: new Date() }),
      create: expect.objectContaining({ ...game, apiId, lastSync: new Date() }),
    }));
  });

  it('Logs errors', async () => {
    const err = 'Test Error';
    const errorPrefix = ERROR.GAME_UPDATE_MANY;
    prismaUpsertSpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.updateMany(games)).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});

describe('findBySeason', () => {
  const prismaFindManySpy = jest.spyOn(prisma.game, 'findMany');

  afterEach(() => {
    prismaFindManySpy.mockReset();
  });

  it('returns empty array if the season in invalid', async () => {
    const games = await GameRepository.findBySeason('one' as any);
    expect(games).toHaveLength(0);
  });

  it('returns games from the database matching the season', async () => {
    const season = 1;
    prismaFindManySpy.mockResolvedValue([mockDBGame]);
    const games = await GameRepository.findBySeason(season);
    expect(prismaFindManySpy).toHaveBeenCalledTimes(1);
    expect(prismaFindManySpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ season }),
    }));
    expect(games).toHaveLength(1);
    expect(games[0]).toBe(mockDBGame);
  });

  it('Logs errors', async () => {
    const season = 1;
    const err = 'Test Error';
    const errorPrefix = ERROR.GAME_FIND_BY_SEASON;
    prismaFindManySpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.findBySeason(season)).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});

describe('findBySeasonBetweenDates', () => {
  const prismaFindManySpy = jest.spyOn(prisma.game, 'findMany');

  afterEach(() => {
    prismaFindManySpy.mockReset();
  });

  it.each([
    [null as any, new Date(), new Date()],
    [1, null as any, new Date()],
    [1, new Date(), null as any],
  ])('returns empty array if invalid arguments are provided', async (season, from, to) => {
    const games = await GameRepository.findBySeasonBetweenDates(season, from, to);
    expect(games).toHaveLength(0);
  });

  it('returns games from the database matching the season', async () => {
    const season = 1;
    const from = new Date();
    const to = new Date();
    prismaFindManySpy.mockResolvedValue([mockDBGame]);
    const games = await GameRepository.findBySeasonBetweenDates(season, from, to);
    expect(prismaFindManySpy).toHaveBeenCalledTimes(1);
    expect(prismaFindManySpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        season,
        AND: expect.arrayContaining([
          expect.objectContaining({ date: { gte: from } }),
          expect.objectContaining({ date: { lte: to } }),
        ]),
      }),
    }));
    expect(games).toHaveLength(1);
    expect(games[0]).toBe(mockDBGame);
  });

  it('Logs errors', async () => {
    const season = 1;
    const err = 'Test Error'; const from = new Date();
    const to = new Date();
    const errorPrefix = ERROR.GAME_FIND_BY_SEASON_IN_DATE_RANGE;
    prismaFindManySpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.findBySeasonBetweenDates(season, from, to)).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});

describe('findBySeasonAndTeam', () => {
  const prismaFindManySpy = jest.spyOn(prisma.game, 'findMany');

  afterEach(() => {
    prismaFindManySpy.mockReset();
  });

  it('returns empty array if no teamIds are provided', async () => {
    const games = await GameRepository.findBySeasonAndTeam(null as any);
    expect(games).toHaveLength(0);
  });

  it.each([
    ['season is a decimal', [1, 2, 3], 1.1 as any],
    ['season is a string', [1, 2, 3], 'invalid' as any],
    ['teamIds are null', null as any, 1],
    ['teamIds are invalid', 'invalid' as any, 1],
  ])('returns empty array if %s', async (_, teamIds, season) => {
    const games = await GameRepository.findBySeasonAndTeam(teamIds, season);
    expect(games).toHaveLength(0);
  });

  it('returns games from the database matching the season', async () => {
    const teamIds = [1, 2, 3];
    const season = 1;
    prismaFindManySpy.mockResolvedValue([mockDBGame]);
    const games = await GameRepository.findBySeasonAndTeam(teamIds, season);
    expect(prismaFindManySpy).toHaveBeenCalledTimes(1);
    expect(prismaFindManySpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        season,
        OR: expect.arrayContaining([
          expect.objectContaining({ homeTeamId: { in: teamIds } }),
          expect.objectContaining({ awayTeamId: { in: teamIds } }),
        ]),
      }),
    }));
    expect(games).toHaveLength(1);
    expect(games[0]).toBe(mockDBGame);
  });

  it('Logs errors', async () => {
    const teamIds = [1, 2, 3];
    const season = 1;
    const err = 'Test Error';
    const errorPrefix = ERROR.GAME_FIND_BY_TEAM;
    prismaFindManySpy.mockImplementationOnce(() => {
      throw new Error(err);
    });
    await expect(() => GameRepository.findBySeasonAndTeam(teamIds, season)).rejects.toThrowError(`${errorPrefix}: ${err}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`${errorPrefix}: ${err}`);
  });
});
