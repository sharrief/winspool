import { TeamStats } from '@/db/dataTypes';
import prisma from '@/db/prisma';
import SeasonStatsRepository from '@/db/repositories/SeasonStatsRepository';
import ERROR from '@/util/errorMessages';
import logger from '@/util/logger';

jest.mock('@/util/logger');
const mockLogger = jest.mocked(logger);

const prismaCreateManySpy = jest.spyOn(prisma.teamSeasonStats, 'createMany');

beforeEach(() => {
  prismaCreateManySpy.mockImplementation(jest.fn());
});

afterEach(() => {
  prismaCreateManySpy.mockReset();
});

const validStats: TeamStats = {
  id: 1, teamId: 1, season: 1, wins: 1, losses: 1, score: 1,
};
const invalidStats = { ...validStats, teamId: 'invalid' };

describe('parseStat', () => {
  it('Parses and removes the id from the stat', () => {
    const result = SeasonStatsRepository.parseStat(validStats);
    const { id, ...parsedStat } = validStats;
    expect(result).toEqual(parsedStat);
  });

  it('Throws and logs error', () => {
    expect(() => SeasonStatsRepository.parseStat(invalidStats))
      .toThrowError(ERROR.STATS_PARSE);
    expect(mockLogger.error)
      .toHaveBeenCalledWith(expect.stringContaining(ERROR.STATS_PARSE));
  });
});

describe('createStats', () => {
  it('Throws and logs error if the stats are invalid', async () => {
    const inputStats = [validStats, invalidStats] as any;
    await expect(SeasonStatsRepository.createStats(inputStats))
      .rejects.toThrow();
    expect(mockLogger.error)
      .toHaveBeenCalledWith(expect.stringContaining(ERROR.STATS_CREATE_MANY));
  });

  it('Saves the stats to the database', async () => {
    const inputStats = [
      validStats,
      { ...validStats, id: 2 },
      { ...validStats, id: 3 },
    ];
    await SeasonStatsRepository.createStats(inputStats);
    expect(prismaCreateManySpy).toHaveBeenCalledTimes(1);
    expect(prismaCreateManySpy).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.arrayContaining(inputStats.map(({ id, ...rest }) => rest)),
    }));
  });
});
