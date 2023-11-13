import React from 'react';
import { TeamTheme } from '@/util/getTeamMeta';
import { StaticImageData } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

/** The props for the TeamCard */
export interface TeamCardProps {
  /** The team name */
  name: string
  /** The team logo image */
  image: string | StaticImageData
  /** The number of wins to display */
  wins: number | string
  /** The number of losses to display */
  losses: number | string
  /** The score to display */
  score: number | string
  /** The team color theme */
  theme: TeamTheme
}

export default function TeamCard({
  name, image, theme,
  wins, losses, score,
}: TeamCardProps) {
  return (
    <div
      className="rounded-xl shadow-xl"
      style={{ backgroundColor: theme.secondaryColor }}
    >
      <div
        className="p-2 rounded-t-xl shadow-xl"
        style={{
          backgroundColor: theme.primaryColor,
        }}
      >
        <figure
          style={{
            height: 200,
            width: 'auto',
            position: 'relative',
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            priority
            sizes="200px"
            style={{
              objectFit: 'contain',
            }}
          />
        </figure>
      </div>
      <div
        className={`px-2 py-11 rounded-b-xl ${theme.secondaryText === 'black' ? 'text-black' : 'text-white'}`}
      >
        <div className="w-full text-center text-lg sm:text-xl">{name}</div>
        <div className="w-full text-center text-lg sm:text-2xl">
          {wins}
          {' '}
          -
          {' '}
          {losses}
        </div>
        <div className="w-full text-center text-lg sm:text-3xl">
          {score}
          {' '}
          pts
        </div>
      </div>
    </div>
  );
}
