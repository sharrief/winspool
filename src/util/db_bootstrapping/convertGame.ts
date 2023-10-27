import { APIGame } from "@/util/db_bootstrapping/apiQueries";

export default function convertGame(g: APIGame) {
  return {
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
  }
}