import { Eye, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import React from 'react';

export function ContentPerformanceTable({ contentPerformance }) {
  if (!contentPerformance || contentPerformance.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border">
        <div className="text-center text-gray-500">
          <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
          <p>콘텐츠 성과 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return '🎥';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '📘';
      case 'tiktok':
        return '🎵';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      case 'tiktok':
        return 'bg-black text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <TrendingUp size={18} className="mr-2 text-green-600" />
          콘텐츠 성과 순위
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          최근 {contentPerformance.length}개 콘텐츠의 성과를 비교해보세요
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순위
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                콘텐츠
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Eye size={14} className="mr-1" />
                  조회수
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Heart size={14} className="mr-1" />
                  좋아요
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <MessageCircle size={14} className="mr-1" />
                  댓글
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Share2 size={14} className="mr-1" />
                  공유
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                참여율
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contentPerformance.map((content, index) => {
              const engagementRate = content.views > 0 
                ? ((content.likes + content.comments + content.shares) / content.views * 100).toFixed(2)
                : 0;

              return (
                <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={content.thumbnail || 'https://via.placeholder.com/60x40?text=No+Image'} 
                        alt={content.title} 
                        className="h-12 w-16 rounded object-cover border border-gray-200" 
                      />
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {content.title}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(content.platform)}`}>
                            {getPlatformIcon(content.platform)} {content.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(content.views)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {formatNumber(content.likes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {formatNumber(content.comments)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {formatNumber(content.shares)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        engagementRate > 5 ? 'bg-green-100 text-green-800' :
                        engagementRate > 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {engagementRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 요약 통계 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">총 조회수</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(contentPerformance.reduce((sum, content) => sum + content.views, 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">총 좋아요</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(contentPerformance.reduce((sum, content) => sum + content.likes, 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">총 댓글</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(contentPerformance.reduce((sum, content) => sum + content.comments, 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">평균 참여율</div>
            <div className="font-semibold text-gray-900">
              {(contentPerformance.reduce((sum, content) => {
                const rate = content.views > 0 
                  ? (content.likes + content.comments + content.shares) / content.views * 100
                  : 0;
                return sum + rate;
              }, 0) / contentPerformance.length).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
