import React from 'react';
import { Game } from '@/db/dataTypes';
import { mockAPITeam } from '@/db/bootstrapping/mockData';
import getTeamMeta from '@/util/getTeamMeta';
import GameCard from './GameCard';

function formatDate(date: Date) {
  return date.toDateString();
}

function sortGamesByDate(games: Game[]): Map<string, Game[]> {
  const map = new Map<string, Game[]>();
  for (const game of games) {
    const { date } = game;
    const gamesOnDate = map.get(formatDate(date));
    if (gamesOnDate) {
      gamesOnDate.push(game);
    } else {
      map.set(formatDate(date), [game]);
    }
  }
  return new Map([...map].sort(([a], [b]) => (new Date(a)).valueOf() - (new Date(b)).valueOf()));
}

export interface GameListProps {
  games: Game[]
}

export default function GameList({ games }: GameListProps) {
  const sortedGames = sortGamesByDate(games);
  return (
    <div>
      {[...sortedGames].map(([date, dateGames]) => (
        <div className="w-full" key={date.toString()}>
          <div className="mb-2">
            <div className="py-5 border-b-2 border-neutral-500 drop-shadow-xl flex flex-row w-full">
              <span className="drop-shadow-md text-xl lg:text-2xl pe-2">
                <h1>{date.toString()}</h1>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {dateGames.map((game) => {
              const homeTeam = getTeamMeta(game.homeTeamId) ?? mockAPITeam;
              const awayTeam = getTeamMeta(game.awayTeamId) ?? mockAPITeam;
              return (
                <div key={game.apiId} className="w-full">
                  <GameCard
                    homeColor={homeTeam.primaryColor}
                    homeAbbreviation={homeTeam.abbreviation}
                    homeLogo={homeTeam.logo}
                    homeScore={game.homeScore}
                    awayColor={awayTeam.primaryColor}
                    awayAbbreviation={awayTeam.abbreviation}
                    awayLogo={awayTeam.logo}
                    awayScore={game.awayScore}
                    timeLeft={game.status}
                    period={`${game.status !== 'Final' ? game.period : ''}`}
                    startTime={game.date.toLocaleTimeString()}
                    startDate={game.date.toDateString()}
                    started={!!game.period}
                    completed={game.status === 'Final'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
