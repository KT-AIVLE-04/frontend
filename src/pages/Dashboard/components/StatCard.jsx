import React from 'react';
import { Card } from '../../../components/molecules';

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  className = "" 
}) {
  const changeColorClasses = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-gray-600"
  };

  const changeIcon = {
    positive: "↗",
    negative: "↘",
    neutral: "→"
  };

  // 아이콘별 색상 매핑
  const iconColorClasses = {
    stores: "text-blue-600",
    contents: "text-purple-600", 
    posts: "text-green-600",
    views: "text-orange-600"
  };

  // title에서 아이콘 타입 추출
  const iconType = title.includes('매장') ? 'stores' : 
                   title.includes('콘텐츠') ? 'contents' :
                   title.includes('게시물') ? 'posts' : 'views';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
              {changeIcon[changeType]} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon size={24} className={iconColorClasses[iconType]} />
          </div>
        )}
      </div>
    </Card>
  );
}
