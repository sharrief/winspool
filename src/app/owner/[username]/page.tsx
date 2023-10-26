import React from 'react';
import prisma from '@/db/prisma';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import messages from '@/util/messages';
import OwnerHeading from '@/components/OwnerHeading';
import TeamCard from '@/components/TeamCard';
import teamThemes, { TeamName } from '@/util/teamThemes';
import { Prisma } from '@prisma/client';
import { SeasonStats } from '@/util/dataAPI/updateStats.script';
import OwnerSeasonSummary, { StatsBySeasonByTeam } from '@/components/OwnerSeasonSummary';

/**
 *
 * @param _username The id of the owner to get
 * @returns The owner or error
 */
export async function getOwnerDraftTeamsBySeason(_username: string) {
  try {
    /** The id must be a positive integer  */
    const validOwnerUsername = z.string();
    const username = validOwnerUsername.parse(_username);
    /** Find the owner by id and include the owner teams */
    const draftSeasons = await prisma.seasonDraft.findMany({
      where: { owner: { username } },
      include: { 
        teams: { include: { teamSeasonStats: true } }, 
        owner: true 
      },
      orderBy: { season: 'desc' }
    });
    const ownerStatsBySeason = new Map<number,SeasonStats>();
    const statsBySeasonByTeam: StatsBySeasonByTeam = draftSeasons.reduce((StatMap, stats) => {
      for (const team of stats.teams) {
        const teamStats = team.teamSeasonStats.find((s) => s.season === stats.season);
        if (!teamStats) continue;

        if (!StatMap.has(stats.season)) StatMap.set(stats.season, new Map());
        const {wins = 0, losses = 0 , ties = 0} = teamStats;
        StatMap.get(stats.season)?.set(team.id, { wins, losses, ties })

        /** Update owner stats */
        if (!ownerStatsBySeason.has(stats.season)) ownerStatsBySeason.set(stats.season, {wins: 0, losses: 0, ties: 0})
        const prev = ownerStatsBySeason.get(stats.season) ?? {wins: 0, losses: 0, ties: 0};
        ownerStatsBySeason.set(stats.season, {
          wins: prev.wins + wins,
          losses: prev.losses + losses,
          ties: prev.ties + ties,
        })
      }
      return StatMap;
    }, new Map<number, Map<number, SeasonStats>>())
    return { draftSeasons, ownerStatsBySeason, statsBySeasonByTeam };
  } catch (e) {
    if (e instanceof ZodError) return { error: fromZodError(e).message };
    return { error: e instanceof Error ? e.message : messages.ERROR_GET_OWNER };
  }
}

/** The props for the OwnerPage */
export interface OwnerPageProps {
  params: {
    /** The id of the owner */
    username: string
  }
}

/** The page to display details for a owner */
export default async function OwnerPage({ params: { username } }: OwnerPageProps) {
  const { error, draftSeasons, ownerStatsBySeason, statsBySeasonByTeam } = await getOwnerDraftTeamsBySeason(username);
  if (error) return <div>{error}</div>
  if (!draftSeasons) return <div>Error: No data for ownerId</div>
  return (draftSeasons.map(({ owner, teams, season }) => (
    <div className='container mx-auto px-5 md:px-20 lg:px-48 py-10'>
      <OwnerSeasonSummary
        ownerStats={ownerStatsBySeason}
        owner={owner}
        teams={teams}
        season={season}
        seasonTeamStats={statsBySeasonByTeam}
      />
    </div>
  ))
  );
}
