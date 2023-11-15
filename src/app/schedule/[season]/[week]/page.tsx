import React from 'react';
import env from '@/util/env';
// import Options from '@/util/options';
import GameList from '@/components/GameList';
import deserializeGame from '@/util/deserializeGame';
import { notFound } from 'next/navigation';
import type API from '@/app/api/API';
import PaginationNavigation from '@/components/PaginationNavigation';
import DropdownNavigation from '@/components/DropdownNavigation';

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
      <div className="py-5 flex">
        <DropdownNavigation
          label={`Season ${season}`}
          options={seasonsMeta
            .filter((m) => m.season !== +season)
            .sort((a, b) => b.season - a.season)
            .map(({ season: s }) => ({ label: `${s}`, path: `/schedule/${s}` }))}
        />
        <PaginationNavigation
          label={`Week ${week}`}
          prevPath={+week > 1 ? `/schedule/${season}/${+week - 1}` : undefined}
          nextPath={`/schedule/${season}/${+week + 1}`}
        />
      </div>
      <GameList games={games} />
    </div>
  );
}
