import { Wifi } from 'lucide-react';
import React from 'react';
import { SOCKET_STATUS, SOCKET_STATUS_COLORS, SOCKET_STATUS_LABELS } from '../../const/socketType';

/**
 * WebSocket 연결 상태를 표시하는 컴포넌트
 * 개발 모드에서만 표시됨
 */
export const WebSocketStatus = ({ isConnecting, isConnected }) => {
  // 개발 모드가 아니면 렌더링하지 않음
  if (!import.meta.env.DEV) {
    return null;
  }

  // 현재 상태 결정
  let currentStatus;
  if (isConnecting) {
    currentStatus = SOCKET_STATUS.CONNECTING;
  } else if (isConnected) {
    currentStatus = SOCKET_STATUS.CONNECTED;
  } else {
    currentStatus = SOCKET_STATUS.DISCONNECTED;
  }

  const statusLabel = SOCKET_STATUS_LABELS[currentStatus];
  const statusColor = SOCKET_STATUS_COLORS[currentStatus];

  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm">
      {currentStatus === SOCKET_STATUS.CONNECTING ? (
        <>
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm text-${statusColor}-700 font-medium`}>{statusLabel}</span>
        </>
      ) : currentStatus === SOCKET_STATUS.CONNECTED ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className={`text-sm text-${statusColor}-700 font-medium`}>{statusLabel}</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-red-500" />
          <span className={`text-sm text-${statusColor}-700 font-medium`}>{statusLabel}</span>
        </>
      )}
    </div>
  );
};
