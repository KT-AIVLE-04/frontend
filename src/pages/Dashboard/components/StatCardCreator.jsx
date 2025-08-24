import { BarChart3, Share2, Store, Video } from 'lucide-react';

export const createStatCard = (type, value, change) => {
  const config = {
    stores: {
      title: '등록된 매장',
      icon: Store
    },
    contents: {
      title: '생성된 콘텐츠',
      icon: Video
    },
    posts: {
      title: 'SNS 게시물',
      icon: Share2
    },
    views: {
      title: '현재 조회수',
      icon: BarChart3
    }
  };

  const {title, icon} = config[type] || config.stores;

  return {
    title,
    value: value?.toString() || '0',
    icon,
    change: change || '+0 (최근 30일)'
  };
}; 