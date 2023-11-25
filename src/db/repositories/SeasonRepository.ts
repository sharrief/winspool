import { SeasonMeta } from '@/db/dataTypes';
import prisma from '@/db/prisma';
import GameRepository from '@/db/repositories/GameRepository';
import LogError from '@/util/decorators/LogError';
import { DateTime } from 'luxon';
import { z } from 'zod';
import ERROR from '@/util/errorMessages';

export default class SeasonRepository {
  /**
   * Validates the season argument
   */
  static seasonValidator = z.number().int();

  /**
   * Validates the weekNumber argument
   */
  static weekValidator = z.number().int();

  /**
   * @param season The season to get games for
   * @param weekNumber The week of the season to get games for
   * @returns An array of Games in the week of the season
   */
  @LogError(ERROR.SEASON_SCHEDULE_GET)
  static async getSchedule(season: number, weekNumber: number) {
    //* Validate the inputs. If either is invalid, return no games.
    const { success: seasonIsValid } = SeasonRepository.seasonValidator.safeParse(season);
    const { success: weekIsValid } = SeasonRepository.weekValidator.safeParse(weekNumber);
    if (!seasonIsValid || !weekIsValid) return [];
    /*
    * Find the start date of the specified season.
    * If we cannot find a start date, return no games.
    */
    const seasonMeta = await prisma.seasonMeta.findFirst({ where: { season } });
    if (!seasonMeta) return [];
    //* Convert the season start date to a 1-indexed week number
    const week = DateTime
      .fromJSDate(seasonMeta.regularSeasonStart).plus({ weeks: weekNumber - 1 }).toUTC();
    const startOfWeek = week.startOf('week');
    const endOfWeek = week.plus({ week: 1 }).startOf('week');
    //* Query for games in the week of the season start date
    const games = await GameRepository.findBySeasonBetweenDates(
      season, // TODO reconsider if we need to specify the season along with the dates
      startOfWeek.toJSDate(),
      endOfWeek.toJSDate(),
    );
    return games;
  }

  /**
   * @param season The season to get metadata for
   * @returns The metadata for the specified season
   */
  static async getSeasonMeta(): Promise<SeasonMeta[]>;
  static async getSeasonMeta(season: number): Promise<SeasonMeta>;
  @LogError(ERROR.SEASON_META_GET)
  static async getSeasonMeta(season?: number) {
    //* Validate the season is either a number or not provided
    const { success: seasonIsValid } = SeasonRepository
      .seasonValidator.optional().safeParse(season);
    if (!seasonIsValid) return null;

    //* Return the metadata for one season if the season year was provided
    if (season != null) {
      return prisma.seasonMeta.findFirst({
        where: { season },
      });
    }
    //* Return metadata for all seasons
    return prisma.seasonMeta.findMany();
  }
}
