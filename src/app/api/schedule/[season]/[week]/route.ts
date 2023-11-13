import { getSchedule } from '@/db/queries';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  context: {
    params: { season: number, week: number },
  },
) {
  const { params } = context;
  const parseSeasonResult = z.number().safeParse(params.season);
  if (!parseSeasonResult.success) notFound();

  const parseWeekResult = z.number().safeParse(params.week);
  if (!parseWeekResult.success) notFound();

  const games = await getSchedule(parseSeasonResult.data, parseWeekResult.data);
  return NextResponse.json(games);
}
