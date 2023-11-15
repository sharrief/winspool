import API from '@/app/api/API';
import { CreateGET } from '@/util/routeFactory';

// eslint-disable-next-line import/prefer-default-export
export const GET = CreateGET(API.getSeasonsMeta);
