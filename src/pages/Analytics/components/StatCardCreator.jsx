import { BarChart3, Heart, MessageSquare, Share2 } from 'lucide-react';

export const StatCardCreator = (type, value, change) => {
  const config = {
    views: {
      title: '조회수',
      icon: BarChart3
    },
    likes: {
      title: '좋아요',
      icon: Heart
    },
    comments: {
      title: '댓글',
      icon: MessageSquare
    },
    shares: {
      title: '공유',
      icon: Share2
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