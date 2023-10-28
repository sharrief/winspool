import prisma from "@/db/prisma";
import { env } from "process";
import { config } from 'dotenv';
import logger from "@/util/logger";
import { APITeam } from "@/db/dataTypes";
config();

export default async function loadTeamsIntoDB() {
  if (await prisma.team.count() > 0) { return console.warn('Teams table not empty'); }
  const res = await fetch(`${env.API_HOST}/teams`);
  if (!res.ok) throw new Error('Could not fetch teams: ' + res.statusText)
  const { data: teams } = (await res.json()) as { data: APITeam[] };
  await prisma.team.createMany({
    data: teams.map(({ full_name, ...rest }) => ({
      fullName: full_name,
      ...rest,
    }))
  });
  logger.log('Loaded teams into db');
}
