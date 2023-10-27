
import React from 'react';
import OwnerHeading from '@/components/OwnerHeading';
import TeamCard from '@/components/TeamCard';
import teamThemes, { TeamName } from '@/util/teamThemes';
import { SeasonStats } from '@/util/db_bootstrapping/updateStats.script';

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
  const { wins } = owner;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 mb-2">
          <OwnerHeading
            name={owner.name || 'Owner' + owner.id}
            place={rank}
            score={wins}
          />
        </div>
        {teams.map(({ id, name, fullName, wins, losses, ties }) => (
          <div className='col-span-2 lg:col-span-1' key={id}>
            <TeamCard
              name={fullName}
              image={`/images/${name.toLowerCase().split(' ').join('_')}.png`}
              theme={teamThemes[name.toLowerCase().split(' ').join('_') as TeamName]}
              wins={wins ?? 'W'}
              losses={losses ?? 'L'}
              ties={ties ?? 'T'}
              score={wins ?? 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}