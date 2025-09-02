import { Wifi } from 'lucide-react';
import React from 'react';

/**
 * WebSocket 연결 상태를 표시하는 컴포넌트
 * 개발 모드에서만 표시됨
 */
export const WebSocketStatus = ({ isConnecting, isConnected }) => {
  // 개발 모드가 아니면 렌더링하지 않음
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm">
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-700 font-medium">연결 중...</span>
        </>
      ) : isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700 font-medium">연결됨</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700 font-medium">연결 안됨</span>
        </>
      )}
    </div>
  );
};
