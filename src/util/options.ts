import env from '@/util/env';

const Options = {
  API_HOST: env.API_HOST,
  MINUTES_BETWEEN_SYNCS: +(env.MINUTES_BETWEEN_SYNCS ?? 5),
};
export default Options;
