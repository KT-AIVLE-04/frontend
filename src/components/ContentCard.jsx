import { Download, Edit, Share2, Trash2 } from 'lucide-react';
import React from 'react';
import { Container } from './Container';

export function ContentCard({ 
  content, 
  onDownload, 
  onEdit, 
  onShare, 
  onDelete,
  showActions = true 
}) {
  return (
    <Container variant="hover" className="overflow-hidden group">
      <div className="relative">
        <img 
          src={content.thumbnail} 
          alt={content.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-150" 
        />
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-3 py-1.5 rounded-full border-2 border-gray-600 font-bold">
            {content.duration}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-black mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-700 transition-colors" title={content.title}>
          {content.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-3 font-bold">
          <span className="font-black">{content.store}</span>
          <span className="mx-2">•</span>
          <span>{content.createdAt}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-4 font-bold">
          <span>{content.views} 조회</span>
          <span className="mx-2">•</span>
          <span>{content.likes} 좋아요</span>
        </div>
        {showActions && (
          <div className="flex justify-between">
            <button 
              onClick={() => onDownload?.(content.id)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => onShare?.(content.id)}
              className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50 border-2 border-transparent hover:border-green-200"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => onEdit?.(content.id)}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete?.(content.id)}
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