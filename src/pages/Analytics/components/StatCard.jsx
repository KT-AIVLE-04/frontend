import React from 'react';
import { Card } from '../../../components/molecules';

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  className = "" 
}) {
  const changeColorClasses = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-gray-600"
  };

  const changeIcon = {
    positive: "↗",
    negative: "↘",
    neutral: "→"
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
              {changeIcon[changeType]} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon size={24} className="text-blue-600" />
          </div>
        )}
      </div>
    </Card>
  );
}
