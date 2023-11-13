import { SeasonStats } from '@/db/dataTypes';
import {
  createStats, deleteStats, getGamesByTeamIds, getPool, getStats,
} from '@/db/queries';
import SyncGames from '@/db/syncGames';
import getRanks from '@/util/getRanks';
import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

type TeamWithStats = Prisma.TeamGetPayload<{}>
& SeasonStats;

type OwnerWithStats = Prisma.OwnerGetPayload<{}>
& SeasonStats
& { teams: TeamWithStats[] };

export type StandingsRouteGETReturnType = ReturnType<typeof getRanks<OwnerWithStats>>;

/**
 * Loads the pools owners and drafted teams.
 * Calculates the wins and losses per owner.
 * @param request The HTTP request
 * @param context Contains the GET parameters
 * @returns Array of owners with teams and win/loss stats
 */
// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  context: {
    params: { poolName: string },
  },
): Promise<NextResponse<StandingsRouteGETReturnType>> {
  /** Load the pool to find the season and teams */
  const { params: { poolName } } = context;
  const draft = await getPool(poolName);
  if (!draft.length) return NextResponse.json([]);
  const { season } = draft[0].winsPool;

  /** Sync the games if needed, then update win/loss stats in the db */
  const gamesUpdated = await SyncGames(season);
  if (gamesUpdated) {
    const teamIds = draft
      .reduce((ids, { teams }) => ids.concat(teams.map(({ id }) => id)), [] as number[]);
    const games = await getGamesByTeamIds(teamIds, season);
    const statsByTeam = aggregateStatsByTeam(games);
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

  /** Fetch the wins/losses from the DB */
  const seasonStats = await getStats(season);
  if (!seasonStats) return NextResponse.json([]);
  const teamSeasonStats = seasonStats.reduce((all, current) => {
    const copy = [...all];
    copy[current.teamId] = current;
    return copy;
  }, [] as typeof seasonStats);

  const ownerStats = await Promise.all(draft.map(async ({ owner, teams }) => {
    let ownerWins = 0; let ownerLosses = 0;
    const teamsWithStats: TeamWithStats[] = [];
    for (const team of teams) {
      const { id } = team;
      const stats = teamSeasonStats[id];
      const { wins = 0, losses = 0 } = stats ?? {};
      teamsWithStats.push({ ...team, wins, losses });
      ownerWins += wins; ownerLosses += losses;
    }
    return {
      ...owner, wins: ownerWins, losses: ownerLosses, teams: teamsWithStats,
    };
  }));

  const rankedOwners = getRanks(ownerStats);

  return NextResponse.json(rankedOwners);
}
