import bootstrapStats from '@/db/bootstrapping/bootstrapStats';
import { createStats, getGamesByTeamIds, getTeams } from '@/db/queries';
import { mockDBGame, mockDBTeam } from '@/db/bootstrapping/mockData';

// Arrange
jest.mock('@/db/queries');
const mockedGetTeams = jest.mocked(getTeams);
const mockedGetGamesByTeamIds = jest.mocked(getGamesByTeamIds);
const mockedCreateStats = jest.mocked(createStats);

describe('bootstrapStats', () => {
  it('inserts stats into the db', async () => {
    mockedGetTeams.mockResolvedValue([
      mockDBTeam,
      { ...mockDBTeam, id: 2 },
      { ...mockDBTeam, id: 3 },
    ]);
    mockedGetGamesByTeamIds.mockResolvedValue([
      {
        ...mockDBGame,
        homeTeamId: 1,
        awayTeamId: 2,
        homeScore: 5,
        awayScore: 4,
      },
      {
        ...mockDBGame,
        homeTeamId: 2,
        awayTeamId: 3,
        homeScore: 10,
        awayScore: 4,
      },
      {
        ...mockDBGame,
        homeTeamId: 1,
        awayTeamId: 3,
        homeScore: 1,
        awayScore: 3,
      },
      {
        ...mockDBGame,
        homeTeamId: 1,
        awayTeamId: 3,
        homeScore: 1,
        awayScore: 3,
      },
    ]);
    // Act
    await bootstrapStats();
    // Assert
    expect(mockedCreateStats).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        season: 2020, teamId: 1, wins: 1, losses: 2, score: 0,
      }),
      expect.objectContaining({
        season: 2020, teamId: 2, wins: 1, losses: 1, score: 0,
      }),
      expect.objectContaining({
        season: 2020, teamId: 3, wins: 2, losses: 1, score: 0,
      }),
    ]));
  });
});
