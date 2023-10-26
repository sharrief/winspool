import prisma from "@/db/prisma"
import { APITeam } from "@/util/dataAPI/loadTeams.script"
import { APIMeta } from "@/util/dataAPI/meta"
import { delay } from "@/util/delay"
import { env } from "process"
import { config } from 'dotenv';
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

async function fetchPage(page = 1, season = 2023) {
  if (!page || !season) throw new Error('Page or season not provided to fetchPage')
  const res = await fetch(`${env.API_HOST}/games?seasons[]=${season}&page=${page}`);
  if (!res.ok) throw new Error('Could not bootstrap games: '+res.statusText);
  return (await res.json()) as { data: APIGame[], meta: APIMeta };

}


async function loadGamesIntoDB() {
  // if (await prisma.game.count() > 0) { return console.warn('Games table not empty'); }
  if (!env.API_HOST) throw new Error(`No API host provided: ${env.API_HOST}`);
  const season = 2020;
  console.log(`Loading games from ${env.API_HOST}`);

  /** First fetch of games is to check for working API and get page count */
  const res = await fetch(`${env.API_HOST}/games?seasons[]=${season}`);
  if (!res.ok) throw new Error('Could not bootstrap games: '+res.statusText);

  let { 
    data: games, 
    meta: { current_page, next_page, total_pages, total_count } } = (await res.json()) as { data: APIGame[], meta: APIMeta };
  let fetchCount = 0;
  let savedCount = 0;
  while (current_page && (next_page && current_page <= total_pages) && fetchCount < 100) {
    const wait = 1000;
    console.log(`Waiting ${wait/1000}s before fetching page ${current_page}`)
    await delay(1000);
    
    ({ data: games, meta: { current_page, next_page, total_pages} }= await fetchPage(current_page, season))
    await prisma.game.createMany({
      data: games.map((g) => ({
        apiId: g.id,
        date: new Date(g.date),
        homeTeamId: g.home_team.id,
        awayTeamId: g.visitor_team.id,
        season: g.season,
        period: g.period,
        status: g.status,
        time: g.time ?? '',
        postseason: g.postseason,
        homeScore: g.home_team_score,
        awayScore: g.visitor_team_score,
      }))
    });
    savedCount += games.length;
    console.log(`Loaded ${savedCount} of ${total_count} games.`);
    current_page = next_page;
    fetchCount++;
  };

}

loadGamesIntoDB();