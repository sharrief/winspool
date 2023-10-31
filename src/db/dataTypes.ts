import { Prisma } from '@prisma/client';

// Prisma types
export type Team<T extends {} = {}> = Prisma.TeamGetPayload<T>;
export type Game<T extends {} = {}> = Prisma.GameGetPayload<T>;
export type Owner<T extends {} = {}> = Prisma.OwnerGetPayload<T>;
export type TeamStats<T extends {} = {}> = Prisma.TeamSeasonStatsGetPayload<T>;
export type SeasonStats = {
  wins: number
  losses: number
  ties: number
};

// API types
export type APIMeta = {
  total_pages: number,
  current_page: number,
  next_page: number,
  per_page: number,
  total_count: number,
};
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
};
export type APITeam = {
  id: number
  abbreviation: string
  city: string
  conference: string
  division: string
  full_name: string
  name: string
};
