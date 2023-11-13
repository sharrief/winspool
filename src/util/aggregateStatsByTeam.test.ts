import { mockDBGame } from '@/db/bootstrapping/mockData';
import aggregateStatsByTeam from '@/util/aggregateStatsByTeam';

describe('aggregateStatByTeam', () => {
  const genMockGame = (homeId: number, awayId: number, homeWin: boolean) => {
    const game = { ...mockDBGame };
    game.homeTeamId = homeId;
    game.awayTeamId = awayId;
    game.homeScore = homeWin ? 10 : 5;
    game.awayScore = homeWin ? 5 : 10;
    return game;
  };
  it('returns a map of team stats', () => {
    // Team1 4-2
    // Team2 4-2
    // Team3 5-1
    const games = [
      genMockGame(1, 2, true),
      genMockGame(1, 2, true),
      genMockGame(1, 2, false),
      genMockGame(1, 3, false),
      genMockGame(1, 3, true),
      genMockGame(1, 3, true),
      genMockGame(2, 3, true),
      genMockGame(2, 3, true),
      genMockGame(2, 3, true),
      genMockGame(4, 5, true),
    ];
    const stats = aggregateStatsByTeam(games);
    expect(stats.get(1)).toHaveProperty('wins', 4);
    expect(stats.get(1)).toHaveProperty('losses', 2);
    expect(stats.get(2)).toHaveProperty('wins', 4);
    expect(stats.get(2)).toHaveProperty('losses', 2);
    expect(stats.get(3)).toHaveProperty('wins', 1);
    expect(stats.get(3)).toHaveProperty('losses', 5);
    expect(stats.get(4)).toHaveProperty('wins', 1);
    expect(stats.get(4)).toHaveProperty('losses', 0);
    expect(stats.get(5)).toHaveProperty('wins', 0);
    expect(stats.get(5)).toHaveProperty('losses', 1);
    expect(stats.get(6)).toBeUndefined();
  });
});
