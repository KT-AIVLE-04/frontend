import React from 'react';
import { analyticsApi } from '../../api/analytics';
import { ErrorPage, LoadingSpinner, StatCard } from '../../components';
import { useApi } from '../../hooks';
import { ActivityItem, createStatCard, TrendSection } from './components';

export function Dashboard() {
  // useApi 훅 사용
  const { data: dashboardData, loading, error, execute: fetchDashboardData } = useApi(analyticsApi.getDashboardStats);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = React.useMemo(() => {
    if (!dashboardData?.data) return [];
    
    const data = dashboardData.data;
    return [
      createStatCard('stores', data.stores, data.storesChange),
      createStatCard('contents', data.contents, data.contentsChange),
      createStatCard('posts', data.posts, data.postsChange),
      createStatCard('views', data.totalViews?.toLocaleString(), data.viewsChange)
    ];
  }, [dashboardData]);

  const activities = dashboardData?.data?.activities || [];

  if (error) {
    return <ErrorPage title="대시보드 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
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
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] lg:col-span-2">
          <h2 className="text-xl font-black text-gray-800 mb-6">최근 활동</h2>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <p className="text-gray-500 text-sm font-bold">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>

        <TrendSection />
      </div>
    </div>
  );
} 