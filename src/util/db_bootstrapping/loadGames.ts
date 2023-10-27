import { config } from 'dotenv';
import { delay } from "@/util/delay"
import { createGames, getGameCount } from "@/util/db_bootstrapping/dbQueries"
import { APIGame, fetchGamesByPage } from "@/util/db_bootstrapping/apiQueries"
import logger from '@/util/logger';
import convertAPIGameToPoolGame from '@/util/db_bootstrapping/convertGame';
config();

/**
 * Fetches a season of games page by page, and loads them into the db
 * @param season The season whose games to load into the db
 */
export default async function loadGamesIntoDB(season = 2020) {
  if (await getGameCount() > 0) { throw new Error('Games table not empty'); }

  /* Keep track of count of saved game for logging */
  let savedCount = 0;

  /*  fetchCount is a failsafe counter to prevent an infinite loop in case 
      next/current page values from api result in non-termination */
  let fetchCount = 0;

  /** The games fetched from the API */
  let games: APIGame[]
  /** The current page number fetched from the API */
  let current_page = 1;
  /** The page number to be fetched next */
  let next_page: number;
  /** The total number of available pages for the season */
  let total_pages: number;
  /** The total number of games available for the season */
  let total_count: number;

  // Loop to fetch pages and save games to the db
  do {
    ({ 
      data: games, 
      meta: { current_page, next_page, total_pages, total_count } 
    } = await fetchGamesByPage(season, current_page))
    fetchCount++;

    // Not sure if the API can even send empty pages, but handle it anyway
    if (!games.length) break;

    await createGames(games.map((g) => (convertAPIGameToPoolGame(g))));
    savedCount += games.length;
    logger.log(`Loaded ${savedCount} of ${total_count} games.`);
    
    // Be nice to the API
    const wait = 1000;
    logger.log(`Waiting ${wait / 1000}s before fetching page ${next_page}`)
    await delay(1000);
    current_page = next_page;

  } while (current_page && current_page <= total_pages && fetchCount < 100);
}
