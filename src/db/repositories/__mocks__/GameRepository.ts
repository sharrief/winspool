import { mockDBGame } from '@/db/bootstrapping/mockData';
import type { Game } from '@/db/dataTypes';
import type Original from '@/db/repositories/GameRepository';

export default class GameRepository implements Original {
  private static games = [mockDBGame, { ...mockDBGame, id: 1 }, { ...mockDBGame, id: 2 }];

  /**
   * Validates an object has the shape of a Game
   * @param rawData An object containing the game data to parse
   * @returns A Game object
   */
  static parseGame = jest.fn(async (rawData: any) => rawData);

  /**
   * @returns The number of games in the database
   */
  static count = jest.fn(async () => GameRepository.games.length);

  /**
   * Validates and saves an array of Games to the database
   * @param games The array of games to save to the database
   */
  static createMany = jest.fn(async (games: Game[]) => {
    GameRepository.games.concat(games);
  });

  /**
   * Validates and saves or updates an array of Games to the database
   * @param games The array of games to upsert to the database
   */
  static updateMany = jest.fn(async () => {});

  /**
   * Returns games in the specified season, or an empty array
   * if no such season exists.
   * @param season The season to find games for
   * @returns The games in the specified season
   */
  static findBySeason = jest.fn(async (season: number) => GameRepository
    .games.filter((g) => g.season === season));

  /**
   * @param season The season to search in
   * @param from The earliest date to find games for
   * @param to The latest date to find games for
   * @returns An array of games in the season between the specified dates
   */
  // eslint-disable-next-line function-paren-newline
  static findBySeasonBetweenDates = jest.fn(async (
    season: number, from: Date, to: Date,
  // eslint-disable-next-line function-paren-newline
  ) => GameRepository.games.filter((g) => g.season === season
      && g.date >= from
      && g.date <= to));

  /**
   *
   * @param teamIds The array of teamIds to find games for
   * @param season The season to filter the games to
   * @returns An array of games for the teamIds provided,
   * optionally filtered to the specified season.
   */
  static findBySeasonAndTeam = jest.fn(
    async (teamIds: number[], season?: number,
    // eslint-disable-next-line function-paren-newline
    ) => GameRepository.games.filter((g) => (season == null || g.season === season)
      && (teamIds.includes(g.homeTeamId) || teamIds.includes(g.awayTeamId))),
  );
}
