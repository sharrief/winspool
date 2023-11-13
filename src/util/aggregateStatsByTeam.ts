import { Game, SeasonStats } from '@/db/dataTypes';

/**
 *
 * @param games The games containing win, loss data
 * @param teamCount The number of teams in each season
 * @returns Map of teamIds to team stats
 */
export default function aggregateStatsByTeam(games: Game[]) {
  const statsByTeam = new Map<number, SeasonStats>();
  for (const game of games) {
    const {
      awayTeamId, homeTeamId, awayScore, homeScore,
    } = game;
    if (!statsByTeam.has(homeTeamId)) {
      statsByTeam.set(
        homeTeamId,
        { wins: 0, losses: 0 },
      );
    }
    if (!statsByTeam.has(awayTeamId)) {
      statsByTeam.set(
        awayTeamId,
        { wins: 0, losses: 0 },
      );
    }
    if (game.status === 'Final') {
      const homeTeamStats = statsByTeam.get(homeTeamId)!;
      const awayTeamStats = statsByTeam.get(awayTeamId)!;
      if (homeScore > awayScore) {
        homeTeamStats.wins += 1;
        awayTeamStats.losses += 1;
      } else {
        homeTeamStats.losses += 1;
        awayTeamStats.wins += 1;
      }
    }
  }
  return statsByTeam;
}
