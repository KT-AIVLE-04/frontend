import React from 'react';
import { Card } from '../../../components';
import { Store } from '../../../models/Store';

export const StoreCard = ({ store, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:scale-105 w-full max-w-52 max-h-80"
    >
      <Card variant="hover" className="p-6 text-center h-full">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#984fff] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
          <span className="text-2xl font-bold text-white">
            {store.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">
          {store.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {Store.getIndustryLabel(store.industry)}
        </p>
        <p className="text-gray-500 text-xs truncate">{store.address}</p>
      </Card>
    </div>
  );
};
