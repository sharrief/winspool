import { Game } from '@/db/dataTypes';
import { z } from 'zod';

const int = z.number().int();
const str = z.string();
const validGame = z.object({
  id: int,
  apiId: int,
  season: int,
  date: str,
  period: int,
  time: str,
  status: str,
  homeTeamId: int,
  homeScore: int,
  awayTeamId: int,
  awayScore: int,
  postseason: z.boolean(),
  lastSync: str.nullable(),
});

export default function deserializeGame(g: unknown): Game {
  const parseResult = validGame.safeParse(g);
  if (!parseResult.success) throw new Error(`Could not deserialize game: ${parseResult.error.message}`);
  const { data: game } = parseResult;
  return ({
    ...game,
    date: new Date(game.date),
    lastSync: game.lastSync ? new Date(game.lastSync) : null,
  });
}
