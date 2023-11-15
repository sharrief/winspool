import type API from '@/app/api/API';
import env from '@/util/env';
import { notFound, redirect } from 'next/navigation';

interface ScheduleSeasonPageProps {
  params: {
    season: number
  }
}

async function getLatestRegularSeasonWeek(
  season: number,
): Promise<ReturnType<typeof API.getLatestRegularSeasonWeek>> {
  const res = await fetch(
    `${env.WEB_HOST}/api/meta/seasons/${season}/latestWeek`,
    { next: { revalidate: 1 } },
  );
  if (!res.ok) notFound();
  const week = await res.json();
  return week;
}

export default async function page(props: ScheduleSeasonPageProps) {
  const { params: { season } } = props;
  const week = await getLatestRegularSeasonWeek(season);
  redirect(`/schedule/${season}/${week}`);
}
