import { config } from 'dotenv';
import { env } from "process"
import { APITeam } from "@/util/db_bootstrapping/loadTeams"
import { APIMeta } from "@/util/db_bootstrapping/meta"
import logger from '@/util/logger';

config();

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

export async function fetchGamesByPage(season = 2023, page = 1) {
  if (!page || !season) throw new Error('Page or season not provided to fetchPage')
  if (!env.API_HOST) throw new Error(`No API host provided: ${env.API_HOST}`);
  logger.log(`Loading games from ${env.API_HOST}`);
  const res = await fetch(`${env.API_HOST}/games?seasons[]=${season}&page=${page}`);
  if (!res.ok) throw new Error('Could not fetch games: ' + res.statusText);
  return (await res.json()) as { data: APIGame[], meta: APIMeta };
}