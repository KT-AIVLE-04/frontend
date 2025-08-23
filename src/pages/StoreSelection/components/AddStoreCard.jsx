import React from 'react';
import { Card } from '../../../components';

export const AddStoreCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:scale-105 w-full max-w-52 max-h-80"
    >
      <Card className="p-6 text-center border-2 border-dashed border-gray-300 hover:border-[#d3b4ff] transition-all duration-300 h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-[#d3b4ff]/50 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-[#d3b4ff]/70 transition-all duration-300">
          <svg className="w-8 h-8 text-[#d3b4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">
          새 매장 추가
        </h3>
        <p className="text-gray-600 text-sm">새로운 매장을 등록하세요</p>
      </Card>
    </div>
  );
};
