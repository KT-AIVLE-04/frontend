import React from 'react';

export function Icon({ 
  icon: IconComponent,
  size = "medium",
  className = "",
  color = "current"
}) {
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24
  };

  const colorClasses = {
    current: "text-current",
    white: "text-white",
    gray: "text-gray-500",
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500"
  };

  return (
    <IconComponent 
      size={sizeMap[size]} 
      className={`${colorClasses[color]} ${className}`}
    />
  );
}
