import React from 'react';
import { Button } from '../../../components/atoms';
import { Card } from '../../../components/molecules';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ""
}) {
  return (
    <Card className={`p-8 text-center ${className}`}>
      {Icon && <Icon size={48} className="text-gray-300 mx-auto mb-4"/>}
      <h3 className="text-lg font-medium text-gray-500 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button
          variant="primary"
          size="medium"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </Card>
  );
}
