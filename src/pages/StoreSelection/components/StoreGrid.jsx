import React from 'react';
import { AddStoreCard } from './AddStoreCard';
import { StoreCard } from './StoreCard';

export const StoreGrid = ({ stores, onStoreSelect, onAddStore }) => {
  return (
    <div className="grid gap-4 mb-12 justify-items-center grid-flow-col">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onClick={() => onStoreSelect(store)}
        />
      ))}
      
      <AddStoreCard onClick={onAddStore} />
    </div>
  );
};
