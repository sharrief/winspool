import { createStats, getGamesByTeamIds, getTeams } from '@/db/queries';
import { Game } from '@/db/dataTypes';

/**
 *
 * @param games The games containing win, loss data
 * @param teamCount The number of teams in each season
 * @returns Map of seasons to teamId-indexed arrays of team stats
 */
function getStatsBySeason(games: Game[], teamCount: number) {
  /** Each seasons array is indexed by the 1-based teamId */
  const statsBySeason = new Map<number, { wins: number, losses: number }[]>();
  for (const game of games) {
    const {
      awayTeamId, homeTeamId, awayScore, homeScore, season,
    } = game;
    if (!statsBySeason.has(season)) {
      statsBySeason.set(
        season,
        Array.from({ length: teamCount + 1 }, () => ({ wins: 0, losses: 0 })),
      );
    }

    const stats = statsBySeason.get(season)!;
    if (homeScore > awayScore) {
      stats[homeTeamId].wins += 1;
      stats[awayTeamId].losses += 1;
    } else {
      stats[homeTeamId].losses += 1;
      stats[awayTeamId].wins += 1;
    }
  }
  return statsBySeason;
}

/**
 * Loads the teams and games to aggregate the win/loss/tie stats
 * per season, per team.
 *
 * Then inserts the stats into the TeamSeasonStats
 * table.
 */
export default async function aggregateTeamSeasonStats() {
  const teamsIds = await getTeams();
  const games = await getGamesByTeamIds(teamsIds.map(({ id }) => id));
  const statsBySeason = getStatsBySeason(games, teamsIds.length);
  await Promise.all([...statsBySeason].map(async ([season, stats]) => {
    const [, ...teams] = stats;
    await createStats(teams
      .map(({ wins, losses }, idx) => ({
        teamId: idx + 1,
        wins,
        losses,
        season,
        ties: 0,
        score: 0,
      })));
  }));
}
