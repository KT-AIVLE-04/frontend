import {BarChart3, Share2, Store, Video} from 'lucide-react';

export const createStatCard = (type, value, change) => {
  const config = {
    stores: {
      title: '등록된 매장',
      icon: <Store size={24} className="text-blue-600"/>
    },
    contents: {
      title: '생성된 콘텐츠',
      icon: <Video size={24} className="text-purple-600"/>
    },
    posts: {
      title: 'SNS 게시물',
      icon: <Share2 size={24} className="text-green-600"/>
    },
    views: {
      title: '현재 조회수',
      icon: <BarChart3 size={24} className="text-orange-600"/>
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