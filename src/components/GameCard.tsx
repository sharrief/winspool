import React from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

interface GameCardProps {
  homeAbbreviation: string
  homeLogo: string | StaticImport
  homeColor: string
  homeScore: number
  awayAbbreviation: string;
  awayLogo: string | StaticImport
  awayColor: string
  awayScore: number
  timeLeft: string
  period: string
  startTime: string
  startDate: string
  started: boolean,
  completed: boolean,
}

export default function GameCard(props: GameCardProps) {
  const {
    homeLogo, homeColor, homeAbbreviation, homeScore,
    awayLogo, awayColor, awayAbbreviation, awayScore,
    timeLeft, period, startTime, startDate, started, completed,
  } = props;
  let winner = '';
  if (completed) {
    winner = homeScore > awayScore ? 'home' : 'away';
  }
  return (
    <div className="shadow-xl grid grid-cols-4 w-full" style={{ height: 75 }}>
      <div
        className="col-span-1 rounded-l-lg flex justify-center align-center"
        style={{
          width: 'auto',
          backgroundColor: awayColor,
          borderRight: '2px solid black',
          height: 75,
        }}
      >
        <Image
          src={awayLogo}
          alt={awayAbbreviation}
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <div className="bg-base-100 text-base-content col-span-2 flex flex-col justify-center align-center px-5">
        <p className="text-center text-base md:text-3xl">
          <span className={`text-center ${winner === 'away' ? 'underline' : ''}`}>
            {awayAbbreviation}
            {' '}
            {started && awayScore}
            {' '}
          </span>
          <span className="text-center">
            {started && '-'}
            {!started && '@'}
          </span>
          <span className={`text-center ${winner === 'home' ? 'underline' : ''}`}>
            {' '}
            {started && homeScore}
            {' '}
            {homeAbbreviation}
          </span>
        </p>
        {started && (
        <p className="text-center">
          {timeLeft}
          {' '}
          {period}
        </p>
        )}
        {!started && (
        <p className="text-center">
          {startTime}
          {' '}
          {startDate}
        </p>
        )}
      </div>
      <div
        className="col-span-1 rounded-r-lg flex justify-center align-center"
        style={{
          width: 'auto',
          backgroundColor: homeColor,
          borderLeft: '2px solid black',
          height: 75,
        }}
      >
        <Image
          src={homeLogo}
          alt={homeAbbreviation}
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}
