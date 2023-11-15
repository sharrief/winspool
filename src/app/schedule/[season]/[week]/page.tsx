import React from 'react';
import env from '@/util/env';
// import Options from '@/util/options';
import GameList from '@/components/GameList';
import deserializeGame from '@/util/deserializeGame';
import { notFound } from 'next/navigation';
import type API from '@/app/api/API';

/** Fetches the games for the provided season and week from the API
 * @param season The season containing the games to fetch
 * @param week The week number of the season, used for pagination
 * @returns An array of games matching the season and week
*/
async function getSchedule(
  season: string,
  week: string,
): Promise<ReturnType<typeof API.getGamesBySeasonAndWeek>> {
  const res = await fetch(
    `${env.WEB_HOST}/api/schedule/${season}/${week}`,
    // { next: { revalidate: Options.MINUTES_BETWEEN_SYNCS * 60 } },
  );
  if (!res.ok) notFound();
  const games = await res.json();
  return games.map((g: unknown) => deserializeGame(g));
}

/** Fetches the metadata for the season from the API
 * @returns The metadata for the season
*/
async function getSeasonMeta(): Promise<ReturnType<typeof API.getSeasonsMeta>> {
  const res = await fetch(`${env.WEB_HOST}/api/meta/seasons`);
  if (!res.ok) return [];
  return res.json();
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
  const seasonsMeta = await getSeasonMeta();
  return (
    <div className="mx-auto w-10/12 sm:w-3/4">
      <div className="py-5 drop-shadow-xl flex flex-row w-full">
        <details className="dropdown drop-shadow-md text-2xl lg:text-5xl flex-auto">
          <summary className="btn">
            Season
            {' '}
            {season}
          </summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
            {seasonsMeta
              .filter((m) => m.season !== +season)
              .sort((a, b) => b.season - a.season)
              .map(({ season: s }) => (
                <li key={s}>
                  <a href={`/schedule/${s}`}>{s}</a>
                </li>
              ))}
          </ul>
        </details>
        <div className="join">
          {+week > 1 && (
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
