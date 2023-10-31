/* eslint-disable no-await-in-loop */
import logger from '@/util/logger';
import { APIGame, APIMeta } from '@/db/dataTypes';
import { z } from 'zod';
import Options from '@/util/options';

type GameDate = {
  year: number;
  month: number;
  day: number;
};
/** Parses a GameDate */
const gameDateValidator = z.object({
  year: z.number().int().min(1970).max(3000),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});
/** Formats a GameDate into a YYYY-MM-DD */
const formateDate = ((d: GameDate) => {
  const date = gameDateValidator.parse(d);
  return `${date.year}-${date.month}-${date.day}`;
});
/** Creates query parameters from season year, from date and to date */
const getQueryParams = (season?: number, from?: GameDate, to?: GameDate) => {
  const params = [
    ['season', season ? `${season}` : ''],
    ['start_date', from ? formateDate(from) : ''],
    ['end_date', to ? formateDate(to) : ''],
  ];
  return params.map(([key, value]) => (value ? `&${key}=${value}` : ''));
};
/**
 * Fetches pages of games from Options.API_HOST/games
 * @param season The season to fetch games for
 * @param from The date from which to fetch succeeding games
 * @param to The date from which to fetch preceding games
 * @yields Arrays of games
 */
export default async function* fetchGames(season: number, from?: GameDate, to?: GameDate) {
  if (!season) throw new Error('Season not provided to fetchGames');
  if (!Options.API_HOST) throw new Error(`No API host provided: ${Options.API_HOST}`);
  /** Query parameters used to filter game search via API */
  const params = getQueryParams(season, from, to);
  /** Updated each loop with API call meta */
  let page = 1;
  /** Updated each loop with API call meta */
  let totalPages = 100;
  /** Counts number of fetch calls made */
  let fetchCount = 0;
  /** Fail safe to prevent infinite API calls */
  const maxFetchCount = 100;
  logger.log(`Loading games from ${Options.API_HOST}`);
  do {
    // Intentional await-in-loop usage to fetch page by page
    const res = await fetch(`${Options.API_HOST}/games?page=${page}${params}`);
    if (!res.ok) throw new Error(`Could not fetch games: ${res.statusText}`);
    const responseData = (await res.json()) as { data: APIGame[], meta: APIMeta };
    yield responseData.data;

    page = responseData.meta.next_page;
    totalPages = responseData.meta.total_pages;
    fetchCount += 1;
  } while (page < totalPages && fetchCount < maxFetchCount);
}
