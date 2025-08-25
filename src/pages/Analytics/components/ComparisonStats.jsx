import React from 'react';

export function ComparisonStats({
  realtimeData,
  historyData,
  comparisonPeriod,
  type
}) {
  if (!realtimeData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center text-gray-500">데이터를 불러오는 중...</div>
      </div>
    );
  }

  const getComparisonLabel = () => {
    switch (comparisonPeriod) {
      case 'yesterday': return '어제';
      case 'week': return '1주일 전';
      case 'month': return '1달 전';
      default: return '어제';
    }
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, percentage: 0, trend: 'neutral' };
    
    const change = current - previous;
    const percentage = ((change / previous) * 100);
    
    return {
      value: change,
      percentage: Math.abs(percentage),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getStats = () => {
    if (type === 'account') {
      const currentFollowers = realtimeData.followers || 0;
      const previousFollowers = historyData?.followers || 0;
      const currentViews = realtimeData.views || 0;
      const previousViews = historyData?.views || 0;

      const followersChange = calculateChange(currentFollowers, previousFollowers);
      const viewsChange = calculateChange(currentViews, previousViews);

      return [
        {
          title: '팔로워',
          current: formatNumber(currentFollowers),
          previous: formatNumber(previousFollowers),
          change: followersChange,
          icon: '👥'
        },
        {
          title: '총 조회수',
          current: formatNumber(currentViews),
          previous: formatNumber(previousViews),
          change: viewsChange,
          icon: '👁️'
        }
      ];
    } else if (type === 'post') {
      const currentLikes = realtimeData.likes || 0;
      const previousLikes = historyData?.likes || 0;
      const currentViews = realtimeData.views || 0;
      const previousViews = historyData?.views || 0;
      const currentComments = realtimeData.comments || 0;
      const previousComments = historyData?.comments || 0;
      const currentShares = realtimeData.shares || 0;
      const previousShares = historyData?.shares || 0;

      return [
        {
          title: '좋아요',
          current: formatNumber(currentLikes),
          previous: formatNumber(previousLikes),
          change: calculateChange(currentLikes, previousLikes),
          icon: '👍'
        },
        {
          title: '조회수',
          current: formatNumber(currentViews),
          previous: formatNumber(previousViews),
          change: calculateChange(currentViews, previousViews),
          icon: '👁️'
        },
        {
          title: '댓글',
          current: formatNumber(currentComments),
          previous: formatNumber(previousComments),
          change: calculateChange(currentComments, previousComments),
          icon: '💬'
        },
        {
          title: '공유',
          current: formatNumber(currentShares),
          previous: formatNumber(previousShares),
          change: calculateChange(currentShares, previousShares),
          icon: '📤'
        }
      ];
    }

    return [];
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {type === 'account' ? '계정' : '게시물'} 성과 ({getComparisonLabel()} 대비)
        </h3>
        <div className="text-sm text-gray-500">
          실시간 vs {getComparisonLabel()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.change.trend === 'up' ? 'bg-green-100 text-green-800' :
                stat.change.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {stat.change.trend === 'up' ? '+' : stat.change.trend === 'down' ? '-' : ''}
                {stat.change.percentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.current}
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {stat.title}
            </div>
            
            <div className="text-xs text-gray-500">
              {getComparisonLabel()}: {stat.previous}
            </div>
          </div>
        ))}
      </div>

      {/* 상세 비교 정보 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">변화 요약</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{stat.title}:</span>
              <span className={`font-medium ${
                stat.change.trend === 'up' ? 'text-green-600' :
                stat.change.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {stat.change.trend === 'up' ? '+' : stat.change.trend === 'down' ? '-' : ''}
                {formatNumber(stat.change.value)} ({stat.change.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
