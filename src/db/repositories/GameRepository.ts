import { Game } from '@/db/dataTypes';
import prisma from '@/db/prisma';
import LogError from '@/util/decorators/LogError';
import ERROR from '@/util/errorMessages';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default class GameRepository {
  static gameShape = z.object({
    id: z.number().int(),
    apiId: z.number().int(),
    date: z.date(),
    season: z.number().int(),
    homeScore: z.number().int(),
    homeTeamId: z.number().int(),
    awayScore: z.number().int(),
    awayTeamId: z.number().int(),
    period: z.number().int(),
    status: z.string(),
    time: z.string(),
    postseason: z.boolean(),
    lastSync: z.date().nullable(),
  });

  /**
   * Validates an object has the shape of a Game
   * @param rawData An object containing the game data to parse
   * @returns A Game object
   */
  @LogError(ERROR.GAME_PARSE)
  static parseGame(rawData: any): Game {
    try {
      return GameRepository.gameShape.parse(rawData);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        throw new Error(fromZodError(e).message);
      }
      throw e;
    }
  }

  /**
   * @returns The number of games in the database
   */
  @LogError(ERROR.GAME_COUNT)
  static async count() {
    const count = await prisma.game.count();
    return count;
  }

  /**
   * Validates and saves an array of Games to the database
   * @param games The array of games to save to the database
   */
  @LogError(ERROR.GAME_CREATE_MANY)
  static async createMany(games: Game[]) {
    if (!games.length) return;
    prisma.game.createMany({
      data: await Promise.all(games
        .map(async (game) => GameRepository.parseGame(game))),
    });
  }

  /**
   * Validates and saves or updates an array of Games to the database
   * @param games The array of games to upsert to the database
   */
  @LogError(ERROR.GAME_UPDATE_MANY)
  static async updateMany(games: Game[]) {
    if (!games.length) return;
    prisma.$transaction(
      games.map((g) => {
        const game = GameRepository.parseGame(g);
        return prisma.game.upsert(
          {
            where: { apiId: game.apiId },
            update: {
              date: game.date,
              homeScore: game.homeScore,
              awayScore: game.awayScore,
              season: game.season,
              period: game.period,
              status: game.status,
              time: game.time,
              postseason: game.postseason,
              homeTeamId: game.homeTeamId,
              awayTeamId: game.awayTeamId,
              lastSync: new Date(),
            },
            create: {
              apiId: game.apiId,
              date: game.date,
              homeScore: game.homeScore,
              awayScore: game.awayScore,
              season: game.season,
              period: game.period,
              status: game.status,
              time: game.time,
              postseason: game.postseason,
              homeTeamId: game.homeTeamId,
              awayTeamId: game.awayTeamId,
              lastSync: new Date(),
            },
          },
        );
      }),
    );
  }

  /**
   * Returns games in the specified season, or an empty array
   * if no such season exists.
   * @param season The season to find games for
   * @returns The games in the specified season
   */
  @LogError(ERROR.GAME_FIND_BY_SEASON)
  static async findBySeason(season: number): Promise<Game[]> {
    const parsedInput = z.number().int().safeParse(season);
    if (!parsedInput.success) return [];
    return prisma.game.findMany({
      where: { season: parsedInput.data },
    });
  }

  /**
   * @param season The season to search in
   * @param from The earliest date to find games for
   * @param to The latest date to find games for
   * @returns An array of games in the season between the specified dates
   */
  @LogError(ERROR.GAME_FIND_BY_SEASON_IN_DATE_RANGE)
  static async findBySeasonBetweenDates(season: number, from: Date, to: Date): Promise<Game[]> {
    const parsedSeason = z.number().int().safeParse(season);
    const parsedFrom = z.date().safeParse(from);
    const parsedTo = z.date().safeParse(to);
    if (!parsedSeason.success || !parsedFrom.success || !parsedTo.success) return [];
    return prisma.game.findMany({
      where: {
        season,
        AND: [
          { date: { gte: from } },
          { date: { lte: to } },
        ],
      },
    });
  }

  /**
   *
   * @param teamIds The array of teamIds to find games for
   * @param season The season to filter the games to
   * @returns An array of games for the teamIds provided,
   * optionally filtered to the specified season.
   */
  @LogError(ERROR.GAME_FIND_BY_TEAM)
  static async findBySeasonAndTeam(teamIds: number[], season?: number): Promise<Game[]> {
    const parsedTeamIds = z.array(z.number()).safeParse(teamIds);
    const parsedSeason = z.number().int().nullable().safeParse(season);
    if (!parsedTeamIds.success || !parsedSeason.success) return [];
    const whereSeason = season ? { season } : {};
    return prisma.game.findMany({
      where: {
        OR: [{ homeTeamId: { in: teamIds } }, { awayTeamId: { in: teamIds } }],
        ...whereSeason,
      },
    });
  }
}
