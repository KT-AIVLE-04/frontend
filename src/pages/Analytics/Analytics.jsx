import { ArrowUp, Calendar, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../../api/analytics';
import { ErrorPage, LoadingSpinner, StatCard } from '../../components';
import { CommentSentiment, createStatCard, DateRangeSelector } from './components';

export function Analytics() {
  const [dateRange, setDateRange] = useState('last7');
  const [overviewStats, setOverviewStats] = useState([]);
  const [contentPerformance, setContentPerformance] = useState([]);
  const [commentSentiment, setCommentSentiment] = useState([]);
  const [followerTrend, setFollowerTrend] = useState({});
  const [optimalPostingTime, setOptimalPostingTime] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const statsResponse = await analyticsApi.getDashboardStats(dateRange);
        const statsData = statsResponse.data?.result;
        
        const stats = statsData.map(stat => 
          createStatCard(stat.type, stat.value, stat.change)
        );
        
        setOverviewStats(stats);

        const performanceResponse = await analyticsApi.getContentPerformance({ dateRange });
        setContentPerformance(performanceResponse.data?.result || []);

        const sentimentResponse = await analyticsApi.getCommentSentiment({ dateRange });
        setCommentSentiment(sentimentResponse.data?.result || []);

        const trendResponse = await analyticsApi.getFollowerTrend({ dateRange });
        setFollowerTrend(trendResponse.data?.result || {});

        const postingTimeResponse = await analyticsApi.getOptimalPostingTime();
        setOptimalPostingTime(postingTimeResponse.data?.result || {});

      } catch (error) {
        console.error('분석 데이터 로딩 실패:', error);
        setError('분석 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  if (error) {
    return <ErrorPage title="분석 데이터 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">성과 분석</h1>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CommentSentiment commentSentiment={commentSentiment} />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users size={18} className="mr-2 text-blue-600" />
            팔로워 트렌드
          </h2>
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-500">총 팔로워</p>
              <p className="text-2xl font-bold">2,145</p>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-sm font-medium">+124</span>
              <ArrowUp size={14} className="ml-1" />
            </div>
          </div>
          <div className="h-40 flex items-end justify-between space-x-2 mt-4">
            {[35, 42, 38, 45, 40, 48, 52].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-100 rounded-t"
                  style={{ height: `${height * 2}px` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {index === 0 ? '월' : index === 1 ? '화' : index === 2 ? '수' : 
                   index === 3 ? '목' : index === 4 ? '금' : index === 5 ? '토' : '일'}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">새 팔로워</p>
                <p className="font-medium">+156</p>
              </div>
              <div>
                <p className="text-gray-500">언팔로우</p>
                <p className="font-medium">-32</p>
              </div>
              <div>
                <p className="text-gray-500">순 증가</p>
                <p className="font-medium text-green-600">+124</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar size={18} className="mr-2 text-orange-600" />
            최적 게시 시간
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">인스타그램</p>
                <p className="text-xs text-gray-500">참여율 기준</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <p className="text-xs mt-1">18-20시</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <p className="text-xs mt-1">12-14시</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <p className="text-xs mt-1">21-23시</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">페이스북</p>
                <p className="text-xs text-gray-500">참여율 기준</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <p className="text-xs mt-1">10-12시</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <p className="text-xs mt-1">15-17시</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <p className="text-xs mt-1">19-21시</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm">
                <span className="font-medium">추천:</span> 다음 콘텐츠는
                <span className="text-blue-600 font-medium"> 월요일 오후 6시</span>
                에 게시하는 것이 가장 효과적입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2 text-green-600" />
          콘텐츠 성과 순위
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    콘텐츠
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    좋아요
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    댓글
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공유
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상세
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contentPerformance.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={content.thumbnail} 
                          alt={content.title} 
                          className="h-10 w-10 rounded object-cover" 
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {content.title}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {content.platform}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {content.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {content.likes.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {content.comments.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {content.shares.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 