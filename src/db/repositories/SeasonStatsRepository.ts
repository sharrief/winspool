import { TeamStats } from '@/db/dataTypes';
import prisma from '@/db/prisma';
import LogError from '@/util/decorators/LogError';
import ERROR from '@/util/errorMessages';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default class SeasonStatsRepository {
  /** Validator for stats */
  static statsValidator = z.object({
    id: z.number().int(),
    season: z.number().int(),
    teamId: z.number().int(),
    wins: z.number().int(),
    losses: z.number().int(),
    score: z.number().int(),
  });

  /**
   * Validates an object has the shape of a Game
   * @param rawData An object containing the game data to parse
   * @returns A Game object
   */
  @LogError(ERROR.STATS_PARSE)
  static parseStat(rawData: any): Omit<TeamStats, 'id'> {
    try {
      return SeasonStatsRepository
        .statsValidator.omit({ id: true }).parse(rawData);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        throw new Error(fromZodError(e).message);
      }
      throw e;
    }
  }

  /**
   * Validates and saves the stats to the database
   * @param stats The array of stats to save to the database
   */
  @LogError(ERROR.STATS_CREATE_MANY)
  static async createStats(stats: Omit<TeamStats, 'id'>[]) {
    const parsedStats = stats.map((s) => SeasonStatsRepository.parseStat(s));
    prisma.teamSeasonStats.createMany({ data: parsedStats });
  }

  /**
   * Gets stats from the database
   * @param season The season to get stats for
   */
  @LogError(ERROR.STATS_FIND_MANY)
  static async findMany(season: number) {
    return prisma.teamSeasonStats.findMany({ where: { season } });
  }

  /**
   * Deletes stats from the database
   * @param season The season to delete stats for
   */
  @LogError(ERROR.STATS_DELETE_MANY)
  static async deleteStats(season: number) {
    return prisma.teamSeasonStats.deleteMany({
      where: { season },
    });
  }
}
