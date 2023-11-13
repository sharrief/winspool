import React from 'react';
import { Game } from '@/db/dataTypes';
import env from '@/util/env';
// import Options from '@/util/options';
import GameList from '@/components/GameList';
import deserializeGame from '@/util/deserializeGame';
import { notFound } from 'next/navigation';

/** Fetches the games for the provided season and week
 * @param season The season containing the games to fetch
 * @param week The week number of the season, used for pagination
*/
async function getSchedule(season: string, week: string): Promise<Game[]> {
  const res = await fetch(
    `${env.WEB_HOST}/api/schedule/${season}/${week}`,
    // { next: { revalidate: Options.MINUTES_BETWEEN_SYNCS * 60 } },
  );
  if (!res.ok) notFound();
  const games = await res.json();
  return games.map((g: unknown) => deserializeGame(g));
}

/** The props for the Schedule page */
export interface SchedulePageProps {
  params: {
    /** The season/year of the schedule */
    season: string
    /** The week number of the season schedule */
    week: string
  }
}

export default async function Schedule({ params: { season, week } }: SchedulePageProps) {
  const games = await getSchedule(season, week);
  return (
    <div className="mx-auto w-10/12 sm:w-3/4">
      <div className="py-5 border-b-2 border-neutral-500 drop-shadow-xl flex flex-row w-full">
        <span className="drop-shadow-md text-2xl lg:text-5xl flex-auto">
          Season
          {' '}
          {season}
        </span>
        <div className="join">
          { +week > 1 && (
          <a
            type="button"
            className="join-item btn"
            href={`/schedule/${season}/${+week - 1}`}
          >
            «
          </a>
          )}
          <button type="button" className="join-item btn">
            Week
            {' '}
            {week}
          </button>
          <a
            type="button"
            className="join-item btn"
            href={`/schedule/${season}/${+week + 1}`}
          >
            »
          </a>
        </div>
      </div>
      <GameList games={games} />
    </div>
  );
}
