import React from 'react';
import { analyticsApi } from '../../api/analytics';
import { contentApi } from '../../api/content';
import { storeApi } from '../../api/store';
import { ErrorPage, LoadingSpinner, StatCard } from '../../components';
import { useMultipleApi } from '../../hooks';
import { ActivityItem, createStatCard, TrendSection } from './components';

export function Dashboard() {
  // useMultipleApi 훅 사용 - 여러 API를 동시에 호출
  const { 
    loading, 
    error, 
    errors,
    results, 
    executeMultiple 
  } = useMultipleApi();

  React.useEffect(() => {
    // 여러 API를 동시에 호출
    executeMultiple({
      dashboard: () => analyticsApi.getDashboardStats(),
      contents: () => contentApi.getContents(),
      stores: () => storeApi.getStores()
    });
  }, [executeMultiple]);

  const stats = React.useMemo(() => {
    if (!results.dashboard?.data) return [];
    
    const data = results.dashboard.data;
    return [
      createStatCard('stores', data.stores, data.storesChange),
      createStatCard('contents', data.contents, data.contentsChange),
      createStatCard('posts', data.posts, data.postsChange),
      createStatCard('views', data.totalViews?.toLocaleString(), data.viewsChange)
    ];
  }, [results.dashboard]);

  const activities = results.dashboard?.data?.activities || [];

  // 전체 에러가 있는 경우 (모든 API가 실패한 경우)
  if (error && Object.keys(errors || {}).length > 0) {
    return <ErrorPage title="대시보드 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      {/* 개별 API 에러 표시 */}
      {errors && Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">일부 데이터를 불러오는데 실패했습니다</h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([key, error]) => {
              const apiName = {
                dashboard: '대시보드 통계',
                contents: '콘텐츠 정보',
                stores: '매장 정보'
              }[key] || key;
              return (
                <li key={key} className="text-sm text-red-700">
                  {apiName}: {error.message || '알 수 없는 오류'}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
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