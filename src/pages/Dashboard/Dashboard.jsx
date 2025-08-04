import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../../api/analytics';
import { ErrorPage, LoadingSpinner, StatCard } from '../../components';
import { ActivityItem, createStatCard, TrendSection } from './components';

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>

        <TrendSection />
      </div>
    </div>
  );
} 