import { BarChart3, Share2, Store, TrendingUp, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../api/analytics';
import { ErrorPage, LoadingSpinner, StatCard } from '../components';

// 통계 카드 생성자 함수
const createStatCard = (type, value, change) => {
  const config = {
    stores: {
      title: '등록된 매장',
      icon: <Store size={24} className="text-blue-600" />
    },
    contents: {
      title: '생성된 콘텐츠',
      icon: <Video size={24} className="text-purple-600" />
    },
    posts: {
      title: 'SNS 게시물',
      icon: <Share2 size={24} className="text-green-600" />
    },
    views: {
      title: '총 조회수',
      icon: <BarChart3 size={24} className="text-orange-600" />
    }
  };

  const { title, icon } = config[type] || config.stores;
  
  return {
    title,
    value: value?.toString() || '0',
    icon,
    change: change || '+0 (최근 30일)'
  };
};

export function Dashboard() {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyticsApi.getDashboardStats();
        const data = response.data;
        
        // 생성자 함수로 stats 배열 생성
        const newStats = [
          createStatCard('stores', data.stores, data.storesChange),
          createStatCard('contents', data.contents, data.contentsChange),
          createStatCard('posts', data.posts, data.postsChange),
          createStatCard('views', data.totalViews?.toLocaleString(), data.viewsChange)
        ];

        setStats(newStats);
        setActivities(data.activities || []);
      } catch (error) {
        console.error('대시보드 데이터 로딩 실패:', error);
        setError('대시보드 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <ErrorPage title="대시보드 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const displayActivities = activities;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 활동 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
          <div className="space-y-4">
                        {displayActivities.length > 0 ? (
              displayActivities.map((activity, index) => (
                <div key={index} className="flex items-start border-b border-gray-100 pb-4 last:border-0">
                  <div className="mr-4">
                    {activity.type === 'content' && <Video size={18} className="text-purple-600" />}
                    {activity.type === 'store' && <Store size={18} className="text-blue-600" />}
                    {activity.type === 'sns' && <Share2 size={18} className="text-green-600" />}
                    {activity.type === 'analytics' && <BarChart3 size={18} className="text-orange-600" />}
                  </div>
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 트렌드 및 인사이트 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2 text-red-500" />
            현재 트렌드
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">인기 해시태그</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #여름맞이
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #카페추천
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #맛집투어
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #신메뉴
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">인기 콘텐츠 유형</p>
              <p className="text-xs text-gray-600 mt-1">
                현재 15-30초 길이의 제품 리뷰 형식 숏폼이 가장 높은 참여율을
                보이고 있습니다.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">최적 게시 시간</p>
              <p className="text-xs text-gray-600 mt-1">
                평일 오후 6-8시, 주말 오전 10-12시에 게시하면 최대 도달률을
                기대할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 