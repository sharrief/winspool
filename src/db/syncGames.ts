import parseGame from '@/db/bootstrapping/parseGame';
import fetchGames from '@/db/fetchGames';
import {
  getLastSyncTime, getSyncInProgress, startGameSync, updateGames,
} from '@/db/queries';
import { getNowInMs, getYesterdayInMs } from '@/util/date';
import Options from '@/util/options';

/**
 * Will update games using latest data from the API,
 * but only when an update is not in process,
 * or when the most recent update was older than
 * the configured time between updates
 * @param season The season to sync games from
 * @returns Whether the sync was performed
 */
export default async function SyncGames(season: number) {
  /* Don't start sync if one is in progress */
  const syncInProgress = await getSyncInProgress();
  if (syncInProgress) return false;

  /* Don't start sync if not enough time has
  passed since last sync */
  const lastSyncTime = await getLastSyncTime();
  const syncDelay = (Options.MINUTES_BETWEEN_SYNCS * 1000);
  const now = getNowInMs();
  if (lastSyncTime && lastSyncTime + syncDelay > now) return false;

  /* Init a sync so subsequent calls during sync don't duplicate fetch calls */
  await startGameSync(now);
  /* Sync games from lastSync or yesterday to today */
  const yesterday = getYesterdayInMs();
  const startTime = (
    lastSyncTime
    && lastSyncTime < yesterday)
    ? lastSyncTime : yesterday;
  const gamePageGenerator = fetchGames(season, startTime, now);
  for await (const page of gamePageGenerator) {
    /* Update games in the DB */
    const games = page.map((g) => parseGame(g));
    await updateGames(games);
  }
  return true;
}
