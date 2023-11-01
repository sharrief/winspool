import { APIGame } from '@/db/dataTypes';
import fetchGames from '@/db/fetchGames';

describe('fetchGames', () => {
  const getFistAndLastGame = (games: APIGame[]) => {
    const earliestGame = games.reduce((prev, curr) => {
      const datePrev = new Date(prev.date);
      const dateCurr = new Date(curr.date);
      if (datePrev.valueOf() < dateCurr.valueOf()) return prev;
      return curr;
    });
    const latestGame = games.reduce((prev, curr) => {
      const datePrev = new Date(prev.date);
      const dateCurr = new Date(curr.date);
      if (datePrev.valueOf() < dateCurr.valueOf()) return prev;
      return curr;
    });
    return { earliestGame, latestGame };
  };

  // ! This test makes a fetch call and does not mock fetch
  it.skip('fetches games between a set of dates', async () => {
    // Arrange
    const startDate = new Date('2022-10-1');
    const endDate = new Date('2022-10-30');
    const gameGenerator = fetchGames(2022, startDate.valueOf(), endDate.valueOf());
    /* All games should be inside this range */

    // Act
    /* Fetch the first page of games */
    const firstPage = await gameGenerator.next();
    const { value: firstPageGames } = firstPage;
    let { done } = firstPage;

    /*
      This loop, in the realistic worst case, with correct behavior
      will iterate 18 times, once for each page of 25 games.
      With 30 teams each playing 15 games on each of 30 days,
      there are 450 games total.
    */
    let lastPage = firstPage;
    let lastPageGames = firstPageGames;
    let iterations = 1; // .next was already called for first page
    const maxIterations = 19; // allow fetching 1 page more than expected last page
    while (!done && iterations <= maxIterations) {
      // eslint-disable-next-line no-await-in-loop
      lastPage = await gameGenerator.next();
      done = lastPage.done;
      if (lastPage.value) lastPageGames = lastPage.value;
      iterations += 1;
    }

    if (!firstPageGames) throw new Error('First page had no games');
    if (!lastPageGames) throw new Error('Last page had no games');

    const {
      earliestGame: firstPageEarliestGame,
      latestGame: fistPageLatestGame,
    } = getFistAndLastGame(firstPageGames);
    const {
      earliestGame: lastPageEarliestGame,
      latestGame: lastPageLatestGame,
    } = getFistAndLastGame(lastPageGames);

    // Assert
    expect(new Date(firstPageEarliestGame.date).valueOf())
      .toBeGreaterThanOrEqual(startDate.valueOf());
    expect(new Date(fistPageLatestGame.date).valueOf())
      .toBeLessThanOrEqual(endDate.valueOf());
    expect(new Date(lastPageEarliestGame.date).valueOf())
      .toBeGreaterThanOrEqual(startDate.valueOf());
    expect(new Date(lastPageLatestGame.date).valueOf())
      .toBeLessThanOrEqual(endDate.valueOf());
  });
});
