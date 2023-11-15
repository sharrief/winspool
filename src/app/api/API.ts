import {
  getSchedule, getDraftPicks,
  getStats, getPool, createStats, deleteStats,
  getGamesForSeason,
  getSeasonsMeta,
} from '@/db/queries';
import { notFound } from 'next/navigation';
import getRanks from '@/util/getRanks';
import { z } from 'zod';
import type { TeamWithStats } from '@/db/dataTypes';
import SyncGames from '@/db/syncGames';
import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';
import { DateTime } from 'luxon';

export default class API {
  static async getSeasonsMeta() {
    const meta = await getSeasonsMeta();
    return meta;
  }

  /**
 * Returns an array of games that occur in the provided season and week
 * @param params.season The HTTP request
 * @param params.week An object containing the season and week in the params
 * @returns An array of games
 */
  static async getGamesBySeasonAndWeek(params: { season: number, week: number }) {
    const parseSeasonResult = z.number().safeParse(+params.season);
    if (!parseSeasonResult.success) notFound();

    const parseWeekResult = z.number().safeParse(+params.week);
    if (!parseWeekResult.success) notFound();

    const games = await getSchedule(parseSeasonResult.data, parseWeekResult.data);
    return games;
  }

  /**
   * Returns an array containing owners, their ranks, teams and season win/loss stats
   * @param params.poolName The name of the pool to get standings for
   */
  static async getPoolStandings(params: { poolName: string }) {
    const { poolName } = params;
    const pool = await getPool(poolName);
    if (!pool) return notFound();

    //* Load and aggregate the pool's season stats by teamId
    const seasonStats = await getStats(pool.season);
    //* There are 30 teams, so teamIds are 1-30, and all[0] === undefined
    const teamSeasonStats = seasonStats.reduce((all, current) => {
      const copy = [...all];
      copy[current.teamId] = current;
      return copy;
    }, [] as typeof seasonStats);

    //* Load the draft picks for the pool and aggregate wins/losses by owner
    const draftPicks = await getDraftPicks(pool.name);
    const ownerStats = await Promise.all(draftPicks.map(async ({ owner, teams }) => {
      let ownerWins = 0; let ownerLosses = 0;
      const teamsWithStats: TeamWithStats[] = [];
      for (const teamInfo of teams) {
        const { id } = teamInfo;
        const { wins = 0, losses = 0 } = teamSeasonStats[id];
        //* Merge the team metadata and the team season stats
        teamsWithStats.push({ ...teamInfo, wins, losses });
        //* Include the team stats in the owner stats
        ownerWins += wins; ownerLosses += losses;
      }
      return {
        ...owner, wins: ownerWins, losses: ownerLosses, teams: teamsWithStats,
      };
    }));

    const rankedOwners = getRanks(ownerStats);
    return rankedOwners;
  }

  /**
   * Loads the latest game data from the external api and updates the data store
   * @param params.season The season to sync games for
   */
  static async updateGamesAndStats(params: { season: number }) {
    const parseSeasonResult = z.number().safeParse(+params.season);
    if (!parseSeasonResult.success) notFound();

    const season = parseSeasonResult.data;
    const gamesUpdated = await SyncGames(season);
    if (gamesUpdated) {
      const games = await getGamesForSeason(season);
      const statsByTeam = aggregateStatsByTeam(games);
      //* Prisma doesn't offer an updateMany
      await deleteStats(season);
      await createStats([...statsByTeam]
        .map(([teamId, { wins, losses }]) => ({
          teamId,
          wins,
          losses,
          season,
          score: 0,
        })));
    }
  }

  /** Loads the latest non-future week of the provided season
   * @param params.season The season to find the latest week for
  */
  static async getLatestRegularSeasonWeek(params: { season: number }) {
    const parseSeasonResult = z.number().safeParse(+params.season);
    if (!parseSeasonResult.success) notFound();

    const seasonMeta = await getSeasonsMeta(parseSeasonResult.data);
    const seasonStart = DateTime.fromJSDate(seasonMeta.regularSeasonStart).startOf('week');
    const seasonEnd = DateTime.fromJSDate(seasonMeta.regularSeasonEnd).startOf('week');
    const thisWeek = DateTime.now().startOf('week');
    if (thisWeek.valueOf() > seasonEnd.valueOf()) {
      const lastWeek = seasonEnd.diff(seasonStart, 'weeks');
      return Math.floor(lastWeek.weeks) + 1;
    }
    const currentWeek = thisWeek.diff(seasonStart, 'weeks');
    return Math.floor(currentWeek.weeks) + 1;
  }
}
