import { APIGame, fetchGamesByPage } from "@/util/db_bootstrapping/apiQueries";
import convertGame from "@/util/db_bootstrapping/convertGame";
import { getGameCount, createGames } from "@/util/db_bootstrapping/dbQueries";
import { APITeam } from "@/util/db_bootstrapping/loadTeams";
import loadGamesIntoDB from "./loadGames"

// Arrange
jest.mock('./dbQueries');
const mockedGetGameCount = jest.mocked(getGameCount);

const mockTeam: APITeam = {
  id: 1, abbreviation: 'ABC', 
  name: 'Alphabets', full_name: 'English Alphabets',
  city: 'English', conference: 'Main', division: 'Half'
}
const mockGame: APIGame = {
  id: 1, date: '', home_team: { ...mockTeam }, visitor_team: { ...mockTeam },
  home_team_score: 0, visitor_team_score: 0, 
  season: 1, status: '', time: '', postseason: false, period: 1 
}

jest.mock('./convertAPIGameToPoolGame')
jest.mocked(convertGame).mockImplementation((a) => a as any);

jest.mock('./apiQueries');
const mockFetchGamesByPage = jest.mocked(fetchGamesByPage)

jest.mock('@/util/logger')
jest.mock('@/util/delay')

describe('loadGamesIntoDB', () => {
  it('throws if the games table is not empty', async () => {
    // Act
    mockedGetGameCount.mockResolvedValueOnce(1);
    // Assert
    await expect(loadGamesIntoDB()).rejects.toThrowError('Games table not empty');
  });

  it('saves games from multiple pages', async () => {
    // Arrange
    const game1 = {...mockGame};
    const game2 = {...mockGame, id: 2 };
    mockedGetGameCount.mockResolvedValueOnce(0);
    mockFetchGamesByPage
    .mockResolvedValueOnce({ data: [game1], meta: {
      current_page: 1, next_page: 2, total_pages: 2, total_count: 2, per_page: 1
    }})
    .mockResolvedValueOnce({ data: [game2], meta: {
      current_page: 2, next_page: 3, total_pages: 2, total_count: 2, per_page: 1
    }});
    // Act
    await loadGamesIntoDB();
    // Assert
    expect(createGames).toHaveBeenNthCalledWith(1, expect.arrayContaining([expect.objectContaining(game1)]))
    expect(createGames).toHaveBeenNthCalledWith(2, expect.arrayContaining([expect.objectContaining(game2)]))
    expect(createGames).toHaveBeenCalledTimes(2);
  }) 
})