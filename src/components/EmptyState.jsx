import React from 'react';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  className = "" 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
      {Icon && <Icon size={48} className="text-gray-300 mx-auto mb-4" />}
      <h3 className="text-lg font-medium text-gray-500 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
} 