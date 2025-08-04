import { BarChart3, MessageSquare, Share2, ThumbsUp } from 'lucide-react';

export const createStatCard = (type, value, change) => {
  const config = {
    views: {
      title: '총 조회수',
      icon: <BarChart3 size={20} className="text-blue-600" />
    },
    likes: {
      title: '좋아요',
      icon: <ThumbsUp size={20} className="text-green-600" />
    },
    comments: {
      title: '댓글',
      icon: <MessageSquare size={20} className="text-purple-600" />
    },
    shares: {
      title: '공유',
      icon: <Share2 size={20} className="text-orange-600" />
    }
  };

  const trend = change.startsWith('+') ? 'up' : change.startsWith('-') ? 'down' : 'neutral';
  
  return {
    title: config[type]?.title || type,
    value: value?.toLocaleString() || '0',
    change: change || '+0%',
    trend: trend,
    icon: config[type]?.icon || <BarChart3 size={20} className="text-gray-600" />
  };
}; 