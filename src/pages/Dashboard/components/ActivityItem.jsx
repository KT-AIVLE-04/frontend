import { BarChart3, Share2, Store, Video } from 'lucide-react';

export const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'content':
        return <Video size={18} className="text-purple-600" />;
      case 'store':
        return <Store size={18} className="text-blue-600" />;
      case 'sns':
        return <Share2 size={18} className="text-green-600" />;
      case 'analytics':
        return <BarChart3 size={18} className="text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start border-b border-gray-100 pb-4 last:border-0">
      <div className="mr-4">
        {getActivityIcon(activity.type)}
      </div>
      <div>
        <p className="text-sm">{activity.message}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
}; 