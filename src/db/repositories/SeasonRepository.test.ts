import { mockDBGame, mockSeasonMeta } from '@/db/bootstrapping/mockData';
import prisma from '@/db/prisma';
import GameRepository from '@/db/repositories/GameRepository';
import SeasonRepository from '@/db/repositories/SeasonRepository';
import ERROR from '@/util/errorMessages';
import { SeasonMeta } from '@prisma/client';

jest.mock('@/db/repositories/GameRepository');
const mockGameRepository = jest.mocked(GameRepository);

const prismaFindFirstSpy = jest.spyOn(prisma.seasonMeta, 'findFirst');
const prismaFindManySpy = jest.spyOn(prisma.seasonMeta, 'findMany');

afterEach(() => {
  prismaFindFirstSpy.mockReset();
  prismaFindManySpy.mockReset();
  mockGameRepository.findBySeasonBetweenDates.mockReset();
});

describe('getSchedule', () => {
  it.each([
    ['an invalid season', 'season' as any, 1],
    ['an invalid week', 1, 'week' as any],
    ['no valid arguments', 'season' as any, 'week' as any],
  ])('returns no games when called with %s', async (_, season, week) => {
    mockGameRepository.findBySeasonBetweenDates.mockImplementation(async () => [
      { ...mockDBGame, id: 1 },
    ]);
    prismaFindFirstSpy.mockResolvedValue(mockSeasonMeta);
    const games = await SeasonRepository.getSchedule(season, week);
    expect(games).toBeDefined();
    expect(games).toHaveLength(0);
  });

  it('Logs thrown errors', async () => {
    const testError = 'Test error';
    prismaFindFirstSpy.mockImplementation(() => { throw new Error(testError); });
    await expect(SeasonRepository.getSchedule(1, 1)).rejects.toThrowError(`${ERROR.SEASON_SCHEDULE_GET}: ${testError}`);
  });

  it('returns games in the season in week specified', async () => {
    const startDate = new Date('2023-11-15');
    const startOfWeek = new Date('2023-11-13');
    const endOfWeek = new Date('2023-11-20');

    prismaFindFirstSpy.mockImplementation(() => ({
      regularSeasonStart: startDate,
    } as any));
    mockGameRepository.findBySeasonBetweenDates.mockImplementation(async () => [
      { ...mockDBGame, id: 1 },
      { ...mockDBGame, id: 12 },
    ]);
    const season = 2020;
    const week = 1;
    const games = await SeasonRepository.getSchedule(season, week);
    expect(prismaFindFirstSpy).toHaveBeenCalledWith({ where: expect.objectContaining({ season }) });
    expect(mockGameRepository.findBySeasonBetweenDates)
      .toHaveBeenCalledWith(season, startOfWeek, endOfWeek);
    expect(games).toBeDefined();
    expect(games).toHaveLength(2);
  });
});

describe('getSeasonMeta', () => {
  it('returns null if the specified season is invalid', async () => {
    const result = await SeasonRepository.getSeasonMeta('invalid' as any);
    expect(result).toBeNull();
  });

  it('returns an array if not provided a season', async () => {
    const expectedSeasonMeta: SeasonMeta[] = [
      {
        id: 1,
        season: 2018,
        regularSeasonStart: new Date('2018-01-01'),
        regularSeasonEnd: new Date('2018-12-31'),
      },
      {
        id: 2,
        season: 2019,
        regularSeasonStart: new Date('2019-01-01'),
        regularSeasonEnd: new Date('2019-12-31'),
      },
    ];
    prismaFindManySpy.mockResolvedValue(expectedSeasonMeta);
    const results = await SeasonRepository.getSeasonMeta();
    expect(results).toBe(expectedSeasonMeta);
  });

  it('returns one season meta if provided a season', async () => {
    const expectedSeasonMeta: SeasonMeta = {
      id: 1,
      season: 2018,
      regularSeasonStart: new Date('2018-01-01'),
      regularSeasonEnd: new Date('2018-12-31'),
    };
    prismaFindFirstSpy.mockResolvedValue(expectedSeasonMeta);
    const results = await SeasonRepository.getSeasonMeta(2018);
    expect(results).toBe(expectedSeasonMeta);
  });

  it('Logs thrown errors', async () => {
    const testError = 'Test Error';
    prismaFindFirstSpy.mockRejectedValue(new Error(testError));
    await expect(SeasonRepository.getSeasonMeta(1)).rejects.toThrowError(`${ERROR.SEASON_META_GET}: ${testError}`);
  });
});
