const ERROR = {
  ERROR_GET_OWNER: 'An error occurred when loading the owner',
  GAME_COUNT: 'Error while getting game count',
  GAME_PARSE: 'Error while parsing a game',
  GAME_CREATE_MANY: 'Error while creating games',
  GAME_UPDATE_MANY: 'Error while updating games',
  GAME_FIND_BY_SEASON: 'Error while loading games for a season',
  GAME_FIND_BY_SEASON_IN_DATE_RANGE: 'Error while loading games in a date range',
  GAME_FIND_BY_TEAM: 'Error while loading games for a team',
  SEASON_SCHEDULE_GET: 'Error while loading the games for a week',
  SEASON_META_GET: 'Error while loading the metadata for a season',
  POOL_FIND_BY_NAME: 'Error while loading the pool',
  STATS_CREATE_MANY: 'Error while creating the stats',
  STATS_PARSE: 'Error while parsing a stat',
  SYNC_GET_LAST: 'Error while loading info about the last sync',
  SYNC_IN_PROGRESS: 'Error while loading sync in progress',
  SYNC_START: 'Error while starting a game sync',
  SYNC_COMPLETE: 'Error while completing a game sync',
};

export default ERROR;
