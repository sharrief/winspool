import env from '@/util/env';

const Options = {
  API_HOST: env.API_HOST,
  MINUTES_BETWEEN_SYNCS: +(env.MINUTES_BETWEEN_SYNCS ?? 10),
  PAGE_SIZE: +(env.PAGE_SIZE ?? 100),
  SECONDS_BETWEEN_FETCH: +(env.SECONDS_BETWEEN_FETCH ?? 1),
  STARTING_SEASON: +(env.STARTING_SEASON ?? 2020),
};
export default Options;
