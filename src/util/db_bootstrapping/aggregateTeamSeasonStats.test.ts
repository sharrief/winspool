import aggregateTeamSeasonStats from "@/util/db_bootstrapping/aggregateTeamSeasonStats"
import { createStats, getGamesByTeamIds, getTeams } from "@/util/db_bootstrapping/dbQueries"
import { mockDBGame, mockDBTeam } from "@/util/db_bootstrapping/mockData"

// Arrange
jest.mock('@/util/db_bootstrapping/dbQueries')
const mockedGetTeams = jest.mocked(getTeams)
const mockedGetGamesByTeamIds = jest.mocked(getGamesByTeamIds)
const mockedCreateStats = jest.mocked(createStats)

describe('aggregateTeamSeasonStats', () => {
  it('inserts stats into the db', async () => {
    mockedGetTeams.mockResolvedValue([
      mockDBTeam,
      { ...mockDBTeam, id: 2 },
      { ...mockDBTeam, id: 3 },
    ]);
    mockedGetGamesByTeamIds.mockResolvedValue([
      {
        ...mockDBGame,
        // 1 WIN 2 LOSS
        homeTeamId: 1, awayTeamId: 2,
        homeScore: 5, awayScore: 4
      },
      {
        ...mockDBGame,
        // 2 WIN 3 LOSS
        homeTeamId: 2, awayTeamId: 3,
        homeScore: 10, awayScore: 4
      },
      {
        ...mockDBGame,
        // 3 WIN 1 LOSS
        homeTeamId: 1, awayTeamId: 3,
        homeScore: 1, awayScore: 3
      },
      {
        ...mockDBGame,
        // SEASON 2
        season: 2,
        // 3 WIN 1 LOSS
        homeTeamId: 1, awayTeamId: 3,
        homeScore: 1, awayScore: 3
      }
    ]);
    // Act
    await aggregateTeamSeasonStats();
    // Assert
    expect(mockedCreateStats).toHaveBeenNthCalledWith(1, expect.arrayContaining([
      expect.objectContaining({ season: 1, teamId: 1, wins: 1, losses: 1 }),
      expect.objectContaining({ season: 1, teamId: 2, wins: 1, losses: 1 }),
      expect.objectContaining({ season: 1, teamId: 3, wins: 1, losses: 1 })
    ]));
    expect(mockedCreateStats).toHaveBeenNthCalledWith(2, expect.arrayContaining([
      expect.objectContaining({ season: 2, teamId: 1, wins: 0, losses: 1 }),
      expect.objectContaining({ season: 2, teamId: 3, wins: 1, losses: 0 }),
    ]));
  });
})