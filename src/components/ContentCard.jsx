import { Download, Edit, Share2, Trash2 } from 'lucide-react';
import React from 'react';

export function ContentCard({ 
  content, 
  onDownload, 
  onEdit, 
  onShare, 
  onDelete,
  showActions = true 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img 
          src={content.thumbnail} 
          alt={content.title} 
          className="w-full h-48 object-cover" 
        />
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {content.duration}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2 line-clamp-2" title={content.title}>
          {content.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{content.store}</span>
          <span className="mx-2">•</span>
          <span>{content.createdAt}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <span>{content.views} 조회</span>
          <span className="mx-2">•</span>
          <span>{content.likes} 좋아요</span>
        </div>
        {showActions && (
          <div className="flex justify-between">
            <button 
              onClick={() => onDownload?.(content.id)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => onShare?.(content.id)}
              className="text-gray-500 hover:text-green-600"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => onEdit?.(content.id)}
              className="text-gray-500 hover:text-purple-600"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete?.(content.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 