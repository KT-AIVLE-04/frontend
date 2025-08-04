import { Calendar, Hash, MessageSquare, Plus } from 'lucide-react';

export const ScheduledPosts = ({ scheduledPosts, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">예약 게시물</h2>
        <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          새 예약
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {scheduledPosts.length > 0 ? (
          scheduledPosts.map((post, index) => (
            <div key={index} className={`p-4 ${index < scheduledPosts.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <MessageSquare size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {post.platform}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {post.scheduledTime}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {post.content}
              </p>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.hashtags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="flex items-center text-xs text-blue-600">
                      <Hash size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => onDelete(post.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            예약된 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}; 