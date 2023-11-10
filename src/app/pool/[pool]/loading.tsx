import React from 'react';
import OwnerPoolSummary from '@/components/OwnerPoolSummary.loading';

/** The page to display details for a owner */
export default async function PoolPageLoading() {
  return ([1, 2, 3, 4, 5].map((id) => (
    <div key={id} className="container mx-auto px-5 md:px-20 lg:px-48 py-10">
      <OwnerPoolSummary />
    </div>
  ))
  );
}
