import SeasonRepository from '@/db/repositories/SeasonRepository';
import PoolRepository from '@/db/repositories/PoolRepository';
import SeasonStatsRepository from '@/db/repositories/SeasonStatsRepository';
import GameRepository from '@/db/repositories/GameRepository';
import GameSyncRepository from '@/db/repositories/GameSyncRepository';
import { notFound } from 'next/navigation';
import getRanks from '@/util/getRanks';
import { z } from 'zod';
import type { TeamWithStats } from '@/db/dataTypes';
import SyncGames from '@/db/syncGames';
import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';
import { DateTime } from 'luxon';
import parseAPIGame from '@/db/bootstrapping/parseAPIGame';
import fetchGames from '@/db/fetchGames';
import { getNowInMs, getYesterdayInMs } from '@/util/date';
import logger from '@/util/logger';
import Options from '@/util/options';
import LogError from '@/util/decorators/LogError';
import ERROR from '@/util/errorMessages';

export default class API {
  /**
   *
   * @returns The metadata for all seasons in the database
   */
  @LogError(ERROR.API_GET_SEASON_META)
  static async getSeasonsMeta() {
    const meta = await SeasonRepository.getSeasonMeta();
    return meta;
  }

  /**
 * Returns an array of games that occur in the provided season and week
 * @param params.season The HTTP request
 * @param params.week An object containing the season and week in the params
 * @returns An array of games
 */
  @LogError(ERROR.API_GET_GAME_BY_SCHEDULE)
  static async getGamesBySeasonAndWeek(params: { season: number, week: number }) {
    const parseSeasonResult = z.number().safeParse(+params.season);
    if (!parseSeasonResult.success) return notFound();

    const parseWeekResult = z.number().safeParse(+params.week);
    if (!parseWeekResult.success) return notFound();

    const games = await SeasonRepository.getSchedule(parseSeasonResult.data, parseWeekResult.data);
    return games;
  }

  /**
   * Returns an array containing owners, their ranks, teams and season win/loss stats
   * @param params.poolName The name of the pool to get standings for
   */
  @LogError(ERROR.API_GET_STANDINGS)
  static async getPoolStandings(params: { poolName: string }) {
    const validParams = z.object({
      poolName: z.string(),
    });
    const validator = validParams.safeParse(params);
    if (!validator.success) return notFound();

    const { poolName } = params;
    const pool = await PoolRepository.findByName(poolName);
    if (!pool) return notFound();

    //* Load and aggregate the pool's season stats by teamId
    const seasonStats = await SeasonStatsRepository.findMany(pool.season);
    //* There are 30 teams, so teamIds are 1-30, and all[0] === undefined
    const teamSeasonStats = seasonStats.reduce((all, current) => {
      const copy = [...all];
      copy[current.teamId] = current;
      return copy;
    }, [] as typeof seasonStats);

    //* Load the draft picks for the pool and aggregate wins/losses by owner
    const draftPicks = await PoolRepository.getDraftPicks(pool.name);
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
  @LogError(ERROR.API_UPDATE_GAMES_STATS)
  static async updateGamesAndStats(params: { season: number }) {
    const validParams = z
      .object({ season: z.number().int() })
      .safeParse(params);
    if (!validParams.success) return notFound();

    const { season } = validParams.data;
    const gamesUpdated = await SyncGames(season);
    if (gamesUpdated) {
      const games = await GameRepository.findBySeason(season);
      const statsByTeam = aggregateStatsByTeam(games);
      //* Prisma doesn't offer an updateMany
      await SeasonStatsRepository.deleteStats(season);
      await SeasonStatsRepository.createStats([...statsByTeam]
        .map(([teamId, { wins, losses }]) => ({
          teamId,
          wins,
          losses,
          season,
          score: 0,
        })));
    }
    return true;
  }

  /** Loads the latest non-future week of the provided season
   * @param params.season The season to find the latest week for
  */
  @LogError(ERROR.API_GET_LATEST_WEEK)
  static async getLatestRegularSeasonWeek(params: { season: number }) {
    const parseParams = z.object({ season: z.number().int() }).safeParse(params);
    if (!parseParams.success) return notFound();

    const seasonMeta = await SeasonRepository.getSeasonMeta(parseParams.data.season);
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

  /** Loads the games from the external API for the given season
   * and saves them to the db, then updates the stats
   * @param params.season The season to sync games for
   */
  @LogError(ERROR.API_SYNC_GAMES)
  static async syncSeasonGames(params: { season: number }) {
    const { season } = params;
    /* Don't start sync if one is in progress */
    const syncInProgress = await GameSyncRepository.getSyncInProgress(season);
    if (syncInProgress) return false;

    /* Don't start sync if not enough time has
    passed since last sync */
    const lastSyncTime = await GameSyncRepository.getLastSyncTime(season);
    const syncDelay = (Options.MINUTES_BETWEEN_SYNCS * 1000);
    const now = getNowInMs();
    if (lastSyncTime && lastSyncTime + syncDelay > now) return false;

    /* Init a sync so subsequent calls during sync don't duplicate fetch calls */
    const syncItem = await GameSyncRepository.startGameSync(now, season);
    /* Sync games from lastSync or yesterday to today */
    const yesterday = getYesterdayInMs();
    const startTime = (
      lastSyncTime
      && lastSyncTime < yesterday)
      ? lastSyncTime : yesterday;
    const gameIds: number[] = [];
    try {
      const gamePageGenerator = fetchGames(season, startTime, now);
      for await (const page of gamePageGenerator) {
        /* Update games in the DB */
        const games = page.map((g) => {
          gameIds.push(g.id);
          return parseAPIGame(g);
        });
        await GameRepository.updateMany(games);
      }
    } catch (e: unknown) {
      logger.error(e instanceof Error ? e.message : e as string);
    }
    await GameSyncRepository.completeGameSync(syncItem.id, getNowInMs(), gameIds);
    return true;
  }
}
