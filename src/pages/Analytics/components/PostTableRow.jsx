import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../../../api/analytics';
import { useApi } from '../../../hooks';
import { ROUTES } from '../../../routes/routes';

export function PostTableRow({ post, index, selectedSnsType, isSelected, onSelect }) {
  const navigate = useNavigate();
  
  // 해당 포스트의 실시간 메트릭 데이터 불러오기
  const { 
    data: metricsData, 
    loading: metricsLoading, 
    error: metricsError,
    execute: executeMetrics 
  } = useApi(analyticsApi.getRealtimePostMetrics);

  useEffect(() => {
    if (!selectedSnsType || !post.id) return;
    executeMetrics(selectedSnsType, post.id);
  }, [selectedSnsType, post.id]);


  return (
    <tr 
      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect && onSelect(post.id)}
    >
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm mr-3 transition-all duration-200 ${
            isSelected 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            {index + 1}
          </div>
          <div>
            <div className={`font-medium truncate max-w-xs transition-colors duration-200 ${
              isSelected ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {post.title || `포스트 ${post.id}`}
            </div>
            <div className={`text-sm transition-colors duration-200 ${
              isSelected ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {post.publishAt
 ? new Date(post.publishAt
 ).toLocaleDateString() : '날짜 없음'}
            </div>
          </div>
        </div>
      </td>
      <td className="text-center py-4 px-4">
        {metricsLoading ? (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <span className={`font-medium transition-colors duration-200 ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {metricsData?.views?.toLocaleString() || '0'}
          </span>
        )}
      </td>
      <td className="text-center py-4 px-4">
        {metricsLoading ? (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <span className={`font-medium transition-colors duration-200 ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {metricsData?.likes?.toLocaleString() || '0'}
          </span>
        )}
      </td>
      <td className="text-center py-4 px-4">
        {metricsLoading ? (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <span className={`font-medium transition-colors duration-200 ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {metricsData?.comments?.toLocaleString() || '0'}
          </span>
        )}
      </td>
      <td className="text-center py-4 px-4">
        {metricsLoading ? (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <span className={`font-medium transition-colors duration-200 ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {metricsData?.shares?.toLocaleString() || '0'}
          </span>
        )}
      </td>
      <td className="text-center py-4 px-4">
        <button 
          className={`inline-flex items-center px-3 py-1.5 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-105 shadow-sm ${
            isSelected 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
          }`}
          onClick={() => {
            // AI 분석 보고서 페이지로 이동
            const reportUrl = ROUTES.AI_REPORT.route
              .replace(':snsType', selectedSnsType)
              .replace(':postId', post.id);
            navigate(reportUrl);
          }}
        >
          AI 분석
        </button>
      </td>
    </tr>
  );
}
