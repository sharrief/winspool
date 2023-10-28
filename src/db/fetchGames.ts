import { config } from 'dotenv';
import { env } from "process"
import { APITeam } from "@/db/bootstrapping/load.teams"
import logger from '@/util/logger';

config();

type APIMeta = {
  total_pages: number,
  current_page: number,
  next_page: number,
  per_page: number,
  total_count: number,
}

export type APIGame = {
  id: number
  date: string
  home_team_score: number
  visitor_team_score: number
  season: number
  period: number,
  status: string,
  time: string,
  postseason: boolean,
  home_team: APITeam,
  visitor_team: APITeam,
}

/**
 * Fetches pages of games from env.API_HOST/games
 * @param season The season to fetch games for
 * @yields Arrays of games
 */
export async function* fetchGames(season = 2023) {
  if (!season) throw new Error('Season not provided to fetchGames')
  if (!env.API_HOST) throw new Error(`No API host provided: ${env.API_HOST}`);
  logger.log(`Loading games from ${env.API_HOST}`);
  let page = 1;
  let total_pages = 100;
  let fetchCount = 0;
  let maxFetchCount = 100;
  do {
    const res = await fetch(`${env.API_HOST}/games?seasons[]=${season}&page=${page}`);
    fetchCount++;
    if (!res.ok) throw new Error('Could not fetch games: ' + res.statusText);
    const responseData = (await res.json()) as { data: APIGame[], meta: APIMeta };
    page = responseData.meta.next_page;
    total_pages = responseData.meta.total_pages;
    yield responseData.data;
  } while (page < total_pages && fetchCount < maxFetchCount);
}