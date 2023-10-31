import prisma from '@/db/prisma';
import { config } from 'dotenv';
import logger from '@/util/logger';
import { APITeam } from '@/db/dataTypes';
import Options from '@/util/options';

config();

export default async function loadTeamsIntoDB() {
  if (await prisma.team.count() > 0) { logger.error('Teams table not empty'); return; }
  const res = await fetch(`${Options.API_HOST}/teams`);
  if (!res.ok) throw new Error(`Could not fetch teams: ${res.statusText}`);
  const { data: teams } = (await res.json()) as { data: APITeam[] };
  await prisma.team.createMany({
    data: teams.map(({ full_name, ...rest }) => ({
      fullName: full_name,
      ...rest,
    })),
  });
  logger.log('Loaded teams into db');
}
