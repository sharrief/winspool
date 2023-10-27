import React from 'react';
import prisma from '@/db/prisma';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import messages from '@/util/messages';
import { SeasonStats } from '@/util/dataAPI/updateStats.script';
import OwnerPoolSummary from '@/components/OwnerPoolSummary';
import { Prisma } from '@prisma/client';
import getRanks from '@/util/getRanks';

/**
 *
 * @param _pool The name of the pool to get
 * @param _season The season stats to get
 * @returns The owner or error
 */
export async function getPoolOwnersAndTeams(_pool: string,  _username = '') {
  try {
    /** The _pool must be a string */
    const validString = z.string();
    const poolName = validString.parse(_pool);

    /** The username must be a string  */
    const validOwnerUsername = z.string();
    const username = validOwnerUsername.parse(_username);

    /** Find the pool by name and include the owners */
    const pool = await prisma.winsPool.findUniqueOrThrow({
      where: { name: poolName },
      include: {
        owners: username ? { where: { username } }: true
      },
    });

    /** Find the teams picked by the owner */
    const draft = await prisma.seasonDraft.findMany({
      where: { season: pool.season, ownerId: { in: pool?.owners.map(({ id }) => id) } },
      include: { owner: true, teams: { include: { teamSeasonStats: { where: { season: pool.season }}}} }
    });
    
    /** Aggregate owner stats and teams */
    const owners: (
      Prisma.OwnerGetPayload<{}> & SeasonStats
      & { teams: ({ id: number, name: string, fullName: string } & SeasonStats)[] }
    )[] = [];
    for (const lineup of draft) {
      let w = 0, l = 0, t = 0;
      const { teams } = lineup;
      const Ts = [];
      for (const team of teams) {
        const { id, fullName, name } = team;
        const stats = team.teamSeasonStats[0];
        const { wins = 0, losses = 0, ties = 0 } = stats;
        const T = { id, name, fullName, wins, losses, ties };
        Ts.push(T)
        w+=wins; l+=losses; t+=ties;
      }
      const { owner: { id, name, username } } = lineup;
      const O = { id, name, username, wins: w, losses: l, ties: t };
      owners.push({
        ...O, teams: Ts
      })
    }

    /** Return the owners with embedded team stats */
    return { owners };
  } catch (e) {
    if (e instanceof ZodError) return { error: fromZodError(e).message };
    return { error: e instanceof Error ? e.message : messages.ERROR_GET_OWNER };
  }
}

/** The props for the OwnerPage */
export interface PoolPageProps {
  params: {
    /** The name of the pool */
    pool: string
  }
}

/** The page to display details for a owner */
export default async function PoolPage({ params: { pool } }: PoolPageProps) {
  const { error, owners } = await getPoolOwnersAndTeams(pool);
  if (error) return <div>{error}</div>
  if (!owners) return <div>Error: No data for pool {pool}</div>
  const rankedOwners = getRanks(owners);
  return (rankedOwners.map((owner) => (
    <div className='container mx-auto px-5 md:px-20 lg:px-48 py-10'>
      <OwnerPoolSummary
        rank={owner.rank}
        owner={owner}
        teams={owner.teams}
      />
    </div>
  ))
  );
}
