import React from 'react';
/** The loading UX for the TeamCard component */
export default function TeamCard() {
  return (
    <div
      className="rounded-xl shadow-xl bg-neutral-400"
    >
      <div
        className="p-2 rounded-t-xl shadow-xl bg-current"
      >
        <figure
          style={{
            height: 200,
            width: 'auto',
          }}
        >
          <div
            className="animate-pulse rounded-full min-h-[200px] inline-block w-full bg-neutral-400 align-middle"
          />
        </figure>
      </div>
      <div
        className="px-2 py-11 rounded-b-xl"
      >
        <div className="text-center text-lg sm:text-xl animate-pulse">
          <span
            className="inline-block min-h-[1em] w-full rounded bg-current text-neutral-700 opacity-50 dark:text-neutral-50"
          />
        </div>
        <div className="text-center text-lg sm:text-2xl animate-pulse">
          <span
            className="inline-block min-h-[1em] w-32 rounded bg-current text-neutral-700 opacity-50 dark:text-neutral-50"
          />
        </div>
        <div className="w-full text-center text-lg sm:text-3xl animate-pulse">
          <span
            className="inline-block min-h-[1em] w-24 rounded bg-current text-neutral-700 opacity-50 dark:text-neutral-50"
          />
        </div>
      </div>
    </div>
  );
}
