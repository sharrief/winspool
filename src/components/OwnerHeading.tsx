import React from 'react';
import '../app/globals.css';

export interface OwnerHeadingProps {
  place: number,
  name: string,
  score: number,
}

export default function OwnerHeading({ place = 999, name = 'N/A', score = 0 }: OwnerHeadingProps) {
  return (
    <div className="py-5 border-b-2 border-neutral-500 drop-shadow-xl flex flex-row w-full">
      <span className="drop-shadow-md text-2xl lg:text-5xl pe-2">
        #
        <span>{place}</span>
      </span>
      <span className="drop-shadow-md text-2xl lg:text-5xl flex-auto">{name}</span>
      <span className="drop-shadow-md text-2xl lg:text-5xl">
        {score}
        {' '}
        pts
      </span>
    </div>
  );
}
