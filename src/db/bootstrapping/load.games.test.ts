import { fetchGames } from "@/db/fetchGames";
import parseGame from "@/db/bootstrapping/parseGame";
import { getGameCount, createGames } from "@/db/queries";
import loadGamesIntoDB from "./load.games"
import { mockAPIGame } from "./mockData";

// Arrange
jest.mock('@/db/queries');
const mockedGetGameCount = jest.mocked(getGameCount);

jest.mock('./parseGame')
jest.mocked(parseGame).mockImplementation((a) => a as any);

jest.mock('@/db/fetchGames');
const mockFetchGames = jest.mocked(fetchGames)

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
    const game1 = { ...mockAPIGame };
    const game2 = { ...mockAPIGame, id: 2 };
    mockedGetGameCount.mockResolvedValueOnce(0);
    mockFetchGames.mockImplementation(async function* () {
      yield [game1]
      yield [game2]
    })
    // Act
    await loadGamesIntoDB();
    // Assert
    expect(createGames).toHaveBeenNthCalledWith(1, expect.arrayContaining([game1]))
    expect(createGames).toHaveBeenNthCalledWith(2, expect.arrayContaining([game2]))
    expect(createGames).toHaveBeenCalledTimes(2);
  })
})