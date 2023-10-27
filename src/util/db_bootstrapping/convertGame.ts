import { APIGame } from "@/util/db_bootstrapping/apiQueries";
import { Game } from "@/util/db_bootstrapping/entities";
import { z } from "zod";

const validAPITeam = z.object({
  id: z.number().int(),
  abbreviation: z.string(),
  city: z.string(),
  conference: z.string(),
  division: z.string(),
  full_name: z.string(),
  name: z.string(),
});

const validAPIGame = z.object({
  id: z.number().int(),
  date: z.string(),
  home_team: validAPITeam,
  visitor_team: validAPITeam,
  season: z.number(),
  period: z.number().int(),
  status: z.string(),
  time: z.string(),
  postseason: z.boolean(),
  home_team_score: z.number().int(),
  visitor_team_score: z.number().int(),
})

export default function convertGame(_game: APIGame): Game {
  const game = validAPIGame.parse(_game);
  return {
    ...game,
    apiId: game.id,
    date: new Date(game.date),
    /** DB stores the teams as fk references */
    homeTeamId: game.home_team.id,
    awayTeamId: game.visitor_team.id,
    homeScore: game.home_team_score,
    awayScore: game.visitor_team_score,
  }
}