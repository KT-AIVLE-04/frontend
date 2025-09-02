/**
 * WebSocket 연결 상태 타입
 */
export const SOCKET_STATUS = {
  /** 연결 중 */
  CONNECTING: 'CONNECTING',
  /** 연결됨 */
  CONNECTED: 'CONNECTED',
  /** 연결 안됨 */
  DISCONNECTED: 'DISCONNECTED'
};

/**
 * WebSocket 연결 상태에 대한 한국어 라벨
 */
export const SOCKET_STATUS_LABELS = {
  [SOCKET_STATUS.CONNECTING]: '연결 중',
  [SOCKET_STATUS.CONNECTED]: '연결됨',
  [SOCKET_STATUS.DISCONNECTED]: '연결 안됨'
};

/**
 * WebSocket 연결 상태에 대한 색상
 */
export const SOCKET_STATUS_COLORS = {
  [SOCKET_STATUS.CONNECTING]: 'blue',
  [SOCKET_STATUS.CONNECTED]: 'green',
  [SOCKET_STATUS.DISCONNECTED]: 'red'
};
