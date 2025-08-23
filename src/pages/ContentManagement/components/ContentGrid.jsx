import React from 'react';
import { ContentCard } from '../../../components';

export const ContentGrid = ({ 
  contents, 
  onCardClick, 
  onDownload, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={{
            id: content.id,
            url: content.url,
            title: content.title,
            contentType: content.contentType,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
            objectKey: content.objectKey
          }}
          onClick={() => onCardClick(content)}
          onDownload={() => onDownload(content)}
          onEdit={() => onEdit(content)}
          onDelete={() => onDelete(content.id)}
        />
      ))}
    </div>
  );
};
