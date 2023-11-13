import React from 'react';
import OwnerHeading from '@/components/OwnerHeading';
import TeamCard from '@/components/TeamCard';
import { SeasonStats } from '@/db/dataTypes';
import getTeamMeta from '@/util/getTeamMeta';

/**
 * The props for the OwnerSeasonSummary
 */
export interface OwnerPoolSummaryProps {
  /** The owner */
  owner: { name: string, id: number } & SeasonStats
  /** The rank of the owner */
  rank: number;
  /** The teams for the owner in the season */
  teams: ({
    id: number
    name: string
    fullName: string
  } & SeasonStats)[]
}

/** The OwnerPage component */
export default function OwnerPoolSummary(props: OwnerPoolSummaryProps) {
  const { owner, rank, teams } = props;
  const { wins: ownerWins } = owner;
  return (
    <div className="w-full">
      <div className="mb-2">
        <OwnerHeading
          name={owner.name || `Owner${owner.id}`}
          place={rank}
          score={ownerWins}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {teams.map(({
          id, wins, losses,
        }) => {
          const team = getTeamMeta(id);
          return (
            <div key={id} className="basis-auto flex-grow">
              <TeamCard
                name={team.fullName}
                image={team.logo}
                theme={team}
                wins={wins ?? 'W'}
                losses={losses ?? 'L'}
                score={wins ?? 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
