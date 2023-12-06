import Original from '@/db/repositories/SeasonStatsRepository';

export default class SeasonStatsRepository implements Original {
  /**
   * Validates an object has the shape of a Game
   * @param rawData An object containing the game data to parse
   * @returns A Game object
   */
  static parseStat = jest.fn((a) => a);

  /**
   * Validates and saves the stats to the database
   * @param stats The array of stats to save to the database
   */
  static createStats = jest.fn();

  /**
   * Gets stats from the database
   * @param season The season to get stats for
   */
  static findMany = jest.fn(async () => []);

  /**
   * Deletes stats from the database
   * @param season The season to delete stats for
   */
  static deleteStats = jest.fn();
}
