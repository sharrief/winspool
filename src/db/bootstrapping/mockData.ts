import {
  APIGame, APITeam, Game, SeasonMeta,
} from '@/db/dataTypes';
import { Team } from '@/util/getTeamMeta';

export const mockAPITeam: APITeam = {
  id: 1,
  abbreviation: 'ABC',
  name: 'Alphabets',
  full_name: 'English Alphabets',
  city: 'English',
  conference: 'Main',
  division: 'Half',
};
export const mockDBTeam: Team = {
  id: mockAPITeam.id,
  abbreviation: mockAPITeam.abbreviation,
  name: mockAPITeam.name as Team['name'],
  fullName: mockAPITeam.full_name,
  city: mockAPITeam.city,
  conference: mockAPITeam.conference,
  division: mockAPITeam.division,
};
export const mockAPIGame: APIGame = {
  id: 1,
  date: '2018-1-1',
  home_team: { ...mockAPITeam },
  visitor_team: { ...mockAPITeam },
  home_team_score: 0,
  visitor_team_score: 0,
  season: 1,
  status: 'Final',
  time: '',
  postseason: false,
  period: 1,
};
export const mockDBGame: Game = {
  apiId: mockAPIGame.id,
  id: mockAPIGame.id,
  date: new Date('2018-1-1'),
  homeTeamId: mockDBTeam.id,
  homeScore: mockAPIGame.home_team_score,
  awayTeamId: mockDBTeam.id,
  awayScore: mockAPIGame.visitor_team_score,
  season: mockAPIGame.season,
  status: mockAPIGame.status,
  time: mockAPIGame.time,
  postseason: mockAPIGame.postseason,
  period: mockAPIGame.period,
  lastSync: null,
};
export const mockSeasonMeta: SeasonMeta = {
  id: 1,
  season: 1,
  regularSeasonStart: new Date('2018-1-1'),
  regularSeasonEnd: new Date('2018-1-1'),
};
