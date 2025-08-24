import {BarChart3, Heart, MessageSquare} from 'lucide-react';

export const StatCardCreator = (type, value, change) => {
  const config = {
    views: {
      title: '조회수',
      icon: <BarChart3 size={24} className="text-blue-600"/>
    },
    likes: {
      title: '좋아요',
      icon: <Heart size={24} className="text-red-600"/>
    },
    comments: {
      title: '댓글',
      icon: <MessageSquare size={24} className="text-green-600"/>
    }
  };

  const {title, icon} = config[type] || config.views;

  return {
    title,
    value: value?.toString() || '0',
    icon,
    change: change || '+0 (전일 대비)'
  };
}; 