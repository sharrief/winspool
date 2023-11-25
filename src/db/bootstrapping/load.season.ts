import { config } from 'dotenv';
import delay from '@/util/delay';
import fetchGames from '@/db/fetchGames';
import logger from '@/util/logger';
import parseAPIGame from '@/db/bootstrapping/parseAPIGame';
import GameRepository from '@/db/repositories/GameRepository';

config();

/**
 * Fetches a season of games page by page, and loads them into the db
 * @param season The season whose games to load into the db
 */
export default async function loadSeasonIntoDB(season: number) {
  if (await GameRepository.count() > 0) { throw new Error('Games table not empty'); }

  /* Keep track of count of saved game for logging */
  let savedCount = 0;

  // Loop to fetch pages and save games to the db
  const fetchGameGenerator = fetchGames(season);
  for await (const games of fetchGameGenerator) {
    // Not sure if the API can even send empty pages, but handle it anyway
    if (!games.length) break;

    /** Parse and save the game */
    await GameRepository.createMany(games.map((g) => (parseAPIGame(g))));
    savedCount += games.length;
    logger.log(`Loaded ${savedCount} games.`);

    // Be nice to the API
    const wait = 1000;
    logger.log(`Waiting ${wait / 1000}s before fetching next page`);
    await delay(1000);
  }
}
