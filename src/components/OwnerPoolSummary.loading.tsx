import React from 'react';
import OwnerHeadingLoading from '@/components/OwnerHeading.loading';
import TeamCardLoading from '@/components/TeamCard.loading';

/** The loading UX for the OwnerPoolSummary component */
export default function OwnerPoolSummaryLoading() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 mb-2">
          <OwnerHeadingLoading />
        </div>
        {[1, 2, 3, 4].map((id) => (
          <div className="col-span-2 lg:col-span-1" key={id}>
            <TeamCardLoading />
          </div>
        ))}
      </div>
    </div>
  );
}
