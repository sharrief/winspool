import Options from '@/util/options';
import { redirect } from 'next/navigation';

export default function page() {
  redirect(`/schedule/${Options.CURRENT_SEASON}`);
}
