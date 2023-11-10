import React from 'react';
import '../app/globals.css';

/**
 *
 * The loading UX for the OwnerHeading component
 */
export default function OwnerHeadingLoading() {
  return (
    <div className="py-5 border-b-2 border-neutral-500 drop-shadow-xl flex flex-row w-full justify-between">
      <div className="w-96">
        <p className="animate-pulse">
          <span
            className="inline-block min-h-[3em] w-full rounded-lg bg-current text-neutral-700 opacity-50 dark:text-neutral-50"
          />
        </p>
      </div>
      <div className="w-32">
        <p className="animate-pulse">
          <span
            className="inline-block min-h-[3em] w-full rounded-lg bg-current text-neutral-700 opacity-50 dark:text-neutral-50"
          />
        </p>
      </div>
    </div>
  );
}
