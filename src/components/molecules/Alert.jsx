import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';
import { IconButton } from '../atoms';

export function Alert({ 
  type = "info",
  title,
  message,
  onClose,
  className = "",
  showIcon = true
}) {
  const alertConfig = {
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500"
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500"
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500"
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500"
    }
  };

  const config = alertConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={`p-4 border-2 rounded-2xl ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <IconComponent size={20} className={config.iconColor} />
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-bold ${config.textColor} mb-1`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-sm ${config.textColor}`}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <div className="flex-shrink-0 ml-3">
            <IconButton
              icon={X}
              variant="secondary"
              size="small"
              onClick={onClose}
              title="닫기"
            />
          </div>
        )}
      </div>
    </div>
  );
}
