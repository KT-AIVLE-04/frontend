import { BarChart3, MessageSquare, Share2, ThumbsUp } from 'lucide-react';

export const createStatCard = (type, currentValue, yesterdayValue) => {
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

  // 어제 대비 증감 계산
  const calculateChange = (current, yesterday) => {
    if (!yesterday || yesterday === 0) return { change: '+0%', trend: 'neutral' };
    
    const difference = current - yesterday;
    const percentage = ((difference / yesterday) * 100).toFixed(1);
    
    if (difference > 0) {
      return { change: `+${percentage}%`, trend: 'up' };
    } else if (difference < 0) {
      return { change: `${percentage}%`, trend: 'down' };
    } else {
      return { change: '+0%', trend: 'neutral' };
    }
  };

  const { change, trend } = calculateChange(currentValue, yesterdayValue);
  
  return {
    title: config[type]?.title || type,
    value: currentValue?.toLocaleString() || '0',
    change: change,
    trend: trend,
    icon: config[type]?.icon || <BarChart3 size={20} className="text-gray-600" />,
    yesterdayValue: yesterdayValue?.toLocaleString() || '0'
  };
}; 