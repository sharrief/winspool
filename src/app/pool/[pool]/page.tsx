import React from 'react';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import messages from '@/util/messages';
import OwnerPoolSummary from '@/components/OwnerPoolSummary';
import env from '@/util/env';
import Options from '@/util/options';
import type API from '@/app/api/API';

async function getPoolStandings(
  poolName: string,
): Promise<ReturnType<typeof API.getPoolStandings>> {
  const res = await fetch(
    `${env.WEB_HOST}/api/${poolName}/standings`,
    { next: { revalidate: Options.MINUTES_BETWEEN_SYNCS * 60 } },
  );
  return res.json();
}

/**
 *
 * @param _pool The name of the pool to get
 * @param _season The season stats to get
 * @returns The owner or error
 */
async function getPoolOwnersAndTeams(_pool: string) {
  try {
    /** The _pool must be a string */
    const validString = z.string();
    const poolName = validString.parse(_pool);

    /** Return the owners with embedded team stats */
    const rankedOwners = await getPoolStandings(poolName);

    return { rankedOwners };
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
  const { error, rankedOwners } = await getPoolOwnersAndTeams(pool);
  if (error) return <div>{error}</div>;
  if (!rankedOwners) {
    return (
      <div>
        Error: No data for pool
        {' '}
        {pool}
      </div>
    );
  }
  return (rankedOwners.map((owner) => (
    <div className="container mx-auto px-5 md:px-20 lg:px-48 py-10">
      <OwnerPoolSummary
        rank={owner.rank}
        owner={owner}
        teams={owner.teams}
      />
    </div>
  ))
  );
}
