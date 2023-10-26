import prisma from "@/db/prisma";

type SeasonStat = { [season: number]: number }

/**
 * Loads the teams and games to aggregate the win/loss/tie stats
 * per season, per team.
 * 
 * Then inserts the stats into the TeamSeasonStats
 * table.
 */
async function updateTeamSeasonStats() {

  /** Find the games for each team */
  const teams = await prisma.team.findMany();
  for (const team of teams) {
    const seasonGames = await prisma.game.findMany({
      where: { OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }] }
    });

    let seasons = new Set<number>();
    let wins: SeasonStat = {};
    let losses: SeasonStat = {};
    let ties: SeasonStat = {};
    let gameCount: {[season: number]: number} = {};

    /** Calculate the seasonal stats for the team */
    for (const game of seasonGames) {
      if (game.status !== 'Final') continue;
      if (game.homeTeamId !== team.id && game.awayTeamId !== team.id) {
        throw new Error(`Game with id ${game.id} doesn't have team with id ${team.id}`);
      }
      const { season } = game;
      if (!seasons.has(season)) {
        seasons.add(season);
        gameCount[season] = 0;
        wins[season] = 0;
        losses[season] = 0;
        ties[season] = 0;
      };
      gameCount[season]++;

      const teamIsHome = game.homeTeamId === team.id;
      if (game.homeScore === game.awayScore) ties[season]++
      else if (game.homeScore > game.awayScore) teamIsHome ? wins[season]++ : losses[season]++;
      else !teamIsHome ? wins[season]++ : losses[season]++;
    }

    /** Insert the seasonal stats for the team */
    for (const season of seasons) {
      console.log(`Inserting ${gameCount[season]} ${season} games for ${team.abbreviation}`)
      await prisma.teamSeasonStats.create({
        data: {
          teamId: team.id,
          wins: wins[season], 
          losses: losses[season], 
          ties: ties[season],
          season,
          score: 0,
        }
      })
    }
  }
}

updateTeamSeasonStats();