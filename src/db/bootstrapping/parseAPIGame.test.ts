import parseAPIGame from '@/db/bootstrapping/parseAPIGame';
import { mockAPIGame, mockDBGame } from '@/db/bootstrapping/mockData';
import sampleGames from './sampleGameData.json';

describe('convertGame', () => {
  it('parses a valid mock game', () => {
    const game = parseAPIGame(mockAPIGame);
    expect(game).toMatchObject(mockDBGame);
  });
  it('parses a sample game', () => {
    const { data: [sampleGame] } = sampleGames;
    const game = parseAPIGame(sampleGame);
    expect(game).toMatchObject({
      apiId: sampleGame.id,
      date: new Date(sampleGame.date),
      homeTeamId: sampleGame.home_team.id,
      homeScore: sampleGame.home_team_score,
      period: sampleGame.period,
      postseason: sampleGame.postseason,
      season: sampleGame.season,
      status: sampleGame.status,
      time: sampleGame.time,
      awayTeamId: sampleGame.visitor_team.id,
      awayScore: sampleGame.visitor_team_score,
    });
  });
  it('throws on invalid input', () => {
    expect(() => parseAPIGame({ ...mockAPIGame, id: '1' as any })).toThrow();
  });
});
