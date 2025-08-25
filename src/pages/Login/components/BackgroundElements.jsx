import React from 'react';

export function BackgroundElements() {
  return (
    <div className="absolute inset-0">
      {/* 만화적 배경 요소들 */}
      <div
        className="absolute top-10 left-8 w-24 h-24 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg"
      />
      <div
        className="absolute bottom-16 right-12 w-20 h-20 bg-green-400 rounded-full border-4 border-green-600 shadow-lg"
      />
      <div
        className="absolute top-1/3 right-1/4 w-16 h-16 bg-red-400 rounded-full border-4 border-red-600 shadow-lg"
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-blue-400 rounded-full border-4 border-blue-600 shadow-lg"
      />

      {/* 만화적 별들 */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-300 transform rotate-45 border-2 border-yellow-500 shadow-lg"
      />

      {/* 만화적 구름 모양 */}
      <div
        className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg"
      />
      <div
        className="absolute bottom-32 left-16 w-28 h-14 bg-white rounded-full border-4 border-gray-300 shadow-lg"
      />
      <div
        className="absolute top-1/4 left-1/4 w-24 h-12 bg-white rounded-full border-4 border-gray-300 shadow-lg"
      />

      {/* 만화적 하트들 */}
      <div
        className="absolute top-40 left-1/4 w-8 h-8 bg-pink-400 transform rotate-45 border-2 border-pink-600 shadow-lg"
      />
      <div
        className="absolute bottom-40 right-1/4 w-6 h-6 bg-pink-400 transform rotate-45 border-2 border-pink-600 shadow-lg"
      />
    </div>
  );
}
