import { Edit, Trash2 } from 'lucide-react'; // Download, Share2 제거
import React from 'react';
import { Container } from './Container';

export function ContentCard({
  content,
  onClick,        // 카드 클릭 핸들러
  onEdit,
  onDelete,
  showActions = true
}) {

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (onClick) {
      onClick(content);
    }
  };

  return (
    <Container
      variant="hover"
      className="overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={content.thumbnailUrl || content.thumbnail}
          alt={content.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-150"
        />
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-3 py-1.5 rounded-full border-2 border-gray-600 font-bold">
            {content.duration}
          </div>
        )}
        {/* 재생 버튼 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="font-black mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-700 transition-colors"
          title={content.title}
        >
          {content.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-3 font-bold">
          <span className="font-black">{content.author || content.store}</span>
          <span className="mx-2">•</span>
          <span>{content.createdAt}</span>
        </div>

        {showActions && (
          <div className="flex justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(content.id);
              }}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(content.id);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 border-2 border-transparent hover:border-red-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}
