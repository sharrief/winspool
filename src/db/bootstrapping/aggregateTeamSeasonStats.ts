import aggregateStatsBySeason from '@/util/aggregateStatsBySeason';
import { createStats, getGamesByTeamIds, getTeams } from '@/db/queries';

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
  const statsBySeason = aggregateStatsBySeason(games, teamsIds.length);
  await Promise.all([...statsBySeason].map(async ([season, stats]) => {
    const [, ...teams] = stats;
    await createStats(teams
      .map(({ wins, losses }, idx) => ({
        teamId: idx + 1,
        wins,
        losses,
        season,
        score: 0,
      })));
  }));
}
