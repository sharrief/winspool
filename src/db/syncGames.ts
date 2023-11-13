import parseAPIGame from '@/db/bootstrapping/parseAPIGame';
import fetchGames from '@/db/fetchGames';
import {
  completeGameSync,
  getLastSyncTime, getSyncInProgress, startGameSync, updateGames,
} from '@/db/queries';
import { getNowInMs, getYesterdayInMs } from '@/util/date';
import Options from '@/util/options';
import logger from '@/util/logger';

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
  const lastSyncTime = await getLastSyncTime(season);
  const syncDelay = (Options.MINUTES_BETWEEN_SYNCS * 1000);
  const now = getNowInMs();
  if (lastSyncTime && lastSyncTime + syncDelay > now) return false;

  /* Init a sync so subsequent calls during sync don't duplicate fetch calls */
  const syncItem = await startGameSync(now, season);
  /* Sync games from lastSync or yesterday to today */
  const yesterday = getYesterdayInMs();
  const startTime = (
    lastSyncTime
    && lastSyncTime < yesterday)
    ? lastSyncTime : yesterday;
  const gameIds: number[] = [];
  try {
    const gamePageGenerator = fetchGames(season, startTime, now);
    for await (const page of gamePageGenerator) {
      /* Update games in the DB */
      const games = page.map((g) => {
        gameIds.push(g.id);
        return parseAPIGame(g);
      });
      await updateGames(games);
    }
  } catch (e: unknown) {
    logger.error(e instanceof Error ? e.message : e as string);
  }
  await completeGameSync(syncItem.id, getNowInMs(), gameIds);
  return true;
}
