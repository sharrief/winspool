import convertGame from "@/util/db_bootstrapping/convertGame"
import { mockAPIGame, mockDBGame } from "@/util/db_bootstrapping/mockData"
import sampleGames from './sampleGameData.json';

describe('convertGame', () => {
  it('parses a valid mock game', () => {
    const game = convertGame(mockAPIGame);
    expect(game).toMatchObject(mockDBGame);
  });
  it('parses a sample game', () => {
    const { data: [sampleGame] } = sampleGames;
    const game = convertGame(sampleGame);
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
      awayScore: sampleGame.visitor_team_score
    },)
  })
  it('throws on invalid input', () => {
    expect(() => convertGame({ ...mockAPIGame, id: '1' as any })).toThrow();
  })
})