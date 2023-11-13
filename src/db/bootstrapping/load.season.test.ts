import fetchGames from '@/db/fetchGames';
import parseAPIGame from '@/db/bootstrapping/parseAPIGame';
import { getGameCount, createGames } from '@/db/queries';
import loadSeasonIntoDB from './load.season';
import { mockAPIGame } from './mockData';

// Arrange
jest.mock('@/db/queries');
const mockedGetGameCount = jest.mocked(getGameCount);

jest.mock('./parseGame');
jest.mocked(parseAPIGame).mockImplementation((a) => a as any);

jest.mock('@/db/fetchGames');
const mockFetchGames = jest.mocked(fetchGames);

jest.mock('@/util/logger');
jest.mock('@/util/delay');

describe('loadGamesIntoDB', () => {
  it('throws if the games table is not empty', async () => {
    // Act
    mockedGetGameCount.mockResolvedValueOnce(1);
    // Assert
    await expect(loadSeasonIntoDB(1)).rejects.toThrowError('Games table not empty');
  });

  it('saves games from multiple pages', async () => {
    // Arrange
    const game1 = { ...mockAPIGame };
    const game2 = { ...mockAPIGame, id: 2 };
    mockedGetGameCount.mockResolvedValueOnce(0);
    mockFetchGames.mockImplementation(async function* mockFetchGamePages() {
      yield [game1];
      yield [game2];
    });
    // Act
    await loadSeasonIntoDB(1);
    // Assert
    expect(createGames).toHaveBeenNthCalledWith(1, expect.arrayContaining([game1]));
    expect(createGames).toHaveBeenNthCalledWith(2, expect.arrayContaining([game2]));
    expect(createGames).toHaveBeenCalledTimes(2);
  });
});
