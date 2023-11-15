import React from 'react';

/** Props for the PaginationNavigation component */
interface PaginationNavigationProps {
  /** The label to display */
  label: string
  /** The path to navigate to when the next button is clicked */
  nextPath: string | undefined
  /** The path to navigate to when the previous button is clicked */
  prevPath: string | undefined
}

/** Renders a component that enables navigating to next and previous pages  */
export default function PaginationNavigation({
  label, prevPath, nextPath,
}: PaginationNavigationProps) {
  return (
    <div className="join">
      {prevPath && (
        <a
          type="button"
          className="join-item btn"
          href={prevPath}
        >
          «
        </a>
      )}
      <button type="button" className="join-item btn">
        {label}
      </button>
      {nextPath && (
        <a
          type="button"
          className="join-item btn"
          href={nextPath}
        >
          »
        </a>
      )}
    </div>
  );
}
