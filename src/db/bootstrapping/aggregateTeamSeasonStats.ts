import { createStats, getGamesByTeamIds, getTeams } from "@/db/queries";
import { Game } from "@/db/dataTypes";

/**
 * Loads the teams and games to aggregate the win/loss/tie stats
 * per season, per team.
 * 
 * Then inserts the stats into the TeamSeasonStats
 * table.
 */
export default async function aggregateTeamSeasonStats() {

  const teams = await getTeams();
  const games = await getGamesByTeamIds(teams.map(({ id }) => id));
  const statsBySeason = getStatsBySeason(games, teams.length);
  for (const [season, stats] of statsBySeason) {
    const [team0, ...teams] = stats;
    await createStats(teams
      .map(({ wins, losses }, idx) => ({
        teamId: idx + 1,
        wins, losses, season,
        ties: 0, score: 0
      }))
    );
  }
}

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
    const { awayTeamId, homeTeamId, awayScore, homeScore, season } = game;
    if (!statsBySeason.has(season)) statsBySeason.set(
      season,
      Array.from({ length: teamCount + 1 }, () => ({ wins: 0, losses: 0 }))
    );

    const stats = statsBySeason.get(season)!;
    if (homeScore > awayScore) {
      stats[homeTeamId].wins++;
      stats[awayTeamId].losses++;
    } else {
      stats[homeTeamId].losses++;
      stats[awayTeamId].wins++
    }
  }
  return statsBySeason;
}
