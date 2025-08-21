import { ArrowUp, Users } from 'lucide-react';
import React from 'react';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export function FollowerTrendChart({ followerTrend }) {
  const weeklyData = followerTrend.weeklyData || [35, 42, 38, 45, 40, 48, 52];
  const totalFollowers = followerTrend.totalFollowers?.toLocaleString() || '0';
  const netGrowth = followerTrend.netGrowth || 0;
  const newFollowers = followerTrend.newFollowers || 0;
  const unfollowers = followerTrend.unfollowers || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Users size={18} className="mr-2 text-blue-600" />
        팔로워 트렌드
      </h2>
      
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-sm text-gray-500">총 팔로워</p>
          <p className="text-2xl font-bold">{totalFollowers}</p>
        </div>
        <div className="flex items-center text-green-600">
          <span className="text-sm font-medium">
            {netGrowth > 0 ? '+' : ''}{netGrowth}
          </span>
          <ArrowUp size={14} className="ml-1" />
        </div>
      </div>
      
      <div className="h-40 flex items-end justify-between space-x-2 mt-4">
        {weeklyData.map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-100 rounded-t"
              style={{ height: `${height * 2}px` }}
            />
            <p className="text-xs text-gray-500 mt-1">{DAYS[index]}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500">새 팔로워</p>
            <p className="font-medium">+{newFollowers}</p>
          </div>
          <div>
            <p className="text-gray-500">언팔로우</p>
            <p className="font-medium">-{unfollowers}</p>
          </div>
          <div>
            <p className="text-gray-500">순 증가</p>
            <p className="font-medium text-green-600">
              {netGrowth > 0 ? '+' : ''}{netGrowth}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
