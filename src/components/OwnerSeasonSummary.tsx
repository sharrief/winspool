
import React from 'react';
import OwnerHeading from '@/components/OwnerHeading';
import TeamCard from '@/components/TeamCard';
import teamThemes, { TeamName } from '@/util/teamThemes';
import { SeasonStats } from '@/util/dataAPI/updateStats.script';

export type StatsBySeasonByTeam = Map<number, Map<number, SeasonStats>>;
export type SeasonStatsByOwner = Map<number, SeasonStats>;
/** 
 * The props for the OwnerSeasonSummary
 */
export interface OwnerSeasonSummaryProps {
  /** The owner */
  owner: { name: string, id: number }
  /** The stat summary for the owner */
  ownerStats: SeasonStatsByOwner
  /** The teams for the owner in the season */
  teams: {
    id: number
    name: string
    fullName: string
  }[]
  seasonTeamStats: StatsBySeasonByTeam
  /** The season year */
  season: number
}

/** The OwnerPage component */
export default function OwnerSeasonSummary(props: OwnerSeasonSummaryProps) {
  const { owner, ownerStats, teams, season, seasonTeamStats } = props;
  const { wins, losses, ties } = ownerStats.get(season) ?? { wins: 0, losses: 0, ties: 0 };
  const teamStatsMap = seasonTeamStats.get(season) ?? new Map();
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className='text-center text-5xl col-span-4' key={season}>{season}</div>
        <div className="col-span-4 mb-2">
          <OwnerHeading
            name={owner.name || 'Owner' + owner.id}
            place={1}
            score={wins}
          />
        </div>
        {teams.map(({ id, name, fullName }) => (
          <div className='col-span-2 lg:col-span-1' key={id}>
            <TeamCard
              name={fullName}
              image={`/images/${name.toLowerCase().split(' ').join('_')}.png`}
              theme={teamThemes[name.toLowerCase().split(' ').join('_') as TeamName]}
              wins={teamStatsMap.get(id)?.wins ?? 'W'}
              losses={teamStatsMap.get(id)?.losses ?? 'L'}
              ties={teamStatsMap.get(id)?.ties ?? 'T'}
              score={teamStatsMap.get(id)?.wins ?? 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}