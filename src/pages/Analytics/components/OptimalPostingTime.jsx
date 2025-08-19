import { Calendar } from 'lucide-react';
import React from 'react';

const PLATFORM_CONFIG = {
  instagram: { color: 'orange', bgColors: ['bg-orange-100', 'bg-orange-50', 'bg-gray-100'] },
  facebook: { color: 'blue', bgColors: ['bg-blue-100', 'bg-blue-50', 'bg-gray-100'] },
  youtube: { color: 'red', bgColors: ['bg-red-100', 'bg-red-50', 'bg-gray-100'] }
};

export function OptimalPostingTime({ optimalPostingTime }) {
  const platforms = ['instagram', 'facebook', 'youtube'];
  const defaultRecommendation = '다음 콘텐츠는 월요일 오후 6시에 게시하는 것이 가장 효과적입니다.';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar size={18} className="mr-2 text-orange-600" />
        최적 게시 시간
      </h2>
      
      <div className="space-y-4">
        {platforms.map((platform, platformIndex) => {
          const platformData = optimalPostingTime[platform];
          if (!platformData) return null;
          
          const config = PLATFORM_CONFIG[platform];
          
          return (
            <div key={platform} className={platformIndex > 0 ? 'pt-4 border-t border-gray-100' : ''}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium capitalize">{platform}</p>
                <p className="text-xs text-gray-500">참여율 기준</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                {platformData.bestTimes?.slice(0, 3).map((time, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${config.bgColors[index]}`}>
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <p className="text-xs mt-1">{time}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm">
            <span className="font-medium">추천:</span> {optimalPostingTime.recommendation || defaultRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
