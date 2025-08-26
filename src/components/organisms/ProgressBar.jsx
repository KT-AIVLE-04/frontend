import React from 'react';
import { Card } from '../molecules';

export function ProgressBar({ 
  progress, 
  label,
  showPercentage = true,
  variant = "default",
  className = ""
}) {
  const variantClasses = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            {showPercentage && (
              <span className="text-sm font-bold text-gray-500">{clampedProgress}%</span>
            )}
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-gray-300">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${variantClasses[variant]}`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
