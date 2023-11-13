import { redirect } from 'next/navigation';

interface ScheduleSeasonPageProps {
  params: {
    season: number
  }
}

export default function page(props: ScheduleSeasonPageProps) {
  const { params: { season } } = props;
  redirect(`/schedule/${season}/1`);
}
