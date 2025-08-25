import React from 'react';
import { AddStoreCard } from './AddStoreCard';
import { StoreCard } from './StoreCard';

export const StoreGrid = ({ stores, onStoreSelect, onAddStore }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center">
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
