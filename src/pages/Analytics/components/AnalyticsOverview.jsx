import React from 'react';
import { StatCard } from './StatCard';

export function AnalyticsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          trend={stat.trend}
          yesterdayValue={stat.yesterdayValue}
        />
      ))}
    </div>
  );
}
