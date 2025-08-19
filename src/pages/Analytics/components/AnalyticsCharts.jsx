import React from 'react';
import { CommentSentiment } from './CommentSentiment';
import { FollowerTrendChart } from './FollowerTrendChart';
import { OptimalPostingTime } from './OptimalPostingTime';

export function AnalyticsCharts({ commentSentiment, followerTrend, optimalPostingTime }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <CommentSentiment commentSentiment={commentSentiment} />
      <FollowerTrendChart followerTrend={followerTrend} />
      <OptimalPostingTime optimalPostingTime={optimalPostingTime} />
    </div>
  );
}
