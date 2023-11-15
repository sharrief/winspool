import Options from '@/util/options';
import React from 'react';

export interface NavBarProps {
  siteName: string;
}

export default function NavBar({ siteName }: NavBarProps) {
  return (
    <div className="navbar p-2 sticky top-0 hidden lg:flex">
      <div className="rounded-xl bg-base-200 lg:flex w-full">
        <div className="navbar-start">
          <button type="button" className="btn btn-ghost text-xl">{siteName}</button>
        </div>
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1 text-lg">
            <li><a href={`/pool/${Options.CURRENT_POOL}`}>Standings</a></li>
            <li><a href="/schedule/">Schedule</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
