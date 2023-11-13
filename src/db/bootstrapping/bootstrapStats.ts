import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';
import { createStats, getGamesByTeamIds, getTeams } from '@/db/queries';

/**
 * Loads the teams and games to aggregate the win/loss/tie stats
 * per season, per team.
 *
 * Then inserts the stats into the TeamSeasonStats
 * table.
 */
export default async function bootstrapStats() {
  const teamsIds = await getTeams();
  await Promise.all([2020, 2021, 2022, 2023].map(async (season) => {
    const games = await getGamesByTeamIds(teamsIds.map(({ id }) => id), season);
    const statsByTeam = aggregateStatsByTeam(games);
    await createStats([...statsByTeam]
      .map(([teamId, { wins, losses }]) => ({
        teamId,
        wins,
        losses,
        season,
        score: 0,
      })));
  }));
}
