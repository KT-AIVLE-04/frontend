import React from 'react';

export function ProgressBar({ 
  percentage, 
  color = "blue", 
  height = "h-2", 
  showPercentage = false,
  className = "" 
}) {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-500", 
    red: "bg-red-500",
    gray: "bg-gray-400",
    purple: "bg-purple-500"
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} ${className}`}>
      <div 
        className={`${colorClasses[color]} ${height} rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {percentage}%
        </div>
      )}
    </div>
  );
} 