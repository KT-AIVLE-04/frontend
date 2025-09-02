import { useCallback, useEffect, useRef, useState } from 'react';
import { SOCKET_STATUS } from '../const/socketType';

export const useWebSocket = (path = '', options = {}) => {
  const { onOpen, onClose, onError } = options;
  const wsRef = useRef(null);
  const [status, setStatus] = useState(SOCKET_STATUS.DISCONNECTED);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [recentMessage, setRecentMessage] = useState(null);

  const connect = useCallback(() => {
    if (status === SOCKET_STATUS.CONNECTING || status === SOCKET_STATUS.CONNECTED) {
      return; // 이미 연결 중이거나 연결된 상태
    }

    setStatus(SOCKET_STATUS.CONNECTING);
    setError(null);

    try {
      // 환경변수 VITE_API_DOMAIN 사용, wss 프로토콜 사용
      const domain = import.meta.env.VITE_API_DOMAIN || 'localhost';
      const wsUrl = `wss://${domain}${path}`;
      
      console.log('WebSocket 연결 시도:', domain , path);
            const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket 연결됨');
        setStatus(SOCKET_STATUS.CONNECTED);
        setError(null);
        console.log('wsRef.current:', wsRef.current);
        console.log('status:', status);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const messageWithTimestamp = {
            ...data,
            timestamp: Date.now()
          };
          
          setMessages(prev => [...prev, messageWithTimestamp]);
          setRecentMessage(messageWithTimestamp);
          setError(null);
        } catch (err) {
          console.error('메시지 파싱 오류:', err);
          const errorMessage = {
            type: 'ERROR',
            message: '메시지 파싱 오류가 발생했습니다.',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, errorMessage]);
          setRecentMessage(errorMessage);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        setStatus(SOCKET_STATUS.DISCONNECTED);
        setError('WebSocket 연결 오류가 발생했습니다.');
      };

      ws.onclose = (event) => {
        console.log('WebSocket 연결 종료:', event.code, event.reason);
        setStatus(SOCKET_STATUS.DISCONNECTED);
      };

    } catch (err) {
      console.error('WebSocket 연결 실패:', err);
      setStatus(SOCKET_STATUS.DISCONNECTED);
      setError('WebSocket 연결에 실패했습니다.');
    }
  }, [path, status]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus(SOCKET_STATUS.DISCONNECTED);
  }, []);

  // status 변경 시 콜백 실행
  useEffect(() => {
    if (status === SOCKET_STATUS.CONNECTED && onOpen) {
      console.log('status가 CONNECTED가 되어 onOpen 콜백 실행');
      onOpen();
    }
    if (status === SOCKET_STATUS.DISCONNECTED && onClose) {
        console.log('status가 DISCONNECTED가 되어 onClose 콜백 실행');
        // onClose는 이벤트 객체가 필요하므로 현재 상태로 호출
        onClose({ code: 1000, reason: 'Normal closure' });
    }
  }, [status]);

  // error 상태 변경 시 onError 콜백 실행
  useEffect(() => {
    if (error && onError) {
      console.log('error가 발생하여 onError 콜백 실행');
      onError(error);
    }
  }, [error, onError]);

  const sendMessage = (message) => {
    console.log('sendMessage 호출됨:', message);
    console.log('wsRef.current:', wsRef.current);
    console.log('status:', status);
    console.log('SOCKET_STATUS.CONNECTED:', SOCKET_STATUS.CONNECTED);
    
    if (!wsRef.current || status !== SOCKET_STATUS.CONNECTED) {
      console.log('WebSocket 연결 상태 불량으로 메시지 전송 실패');
      setError('WebSocket이 연결되지 않았습니다.');
      return false;
    }

    try {
      console.log('WebSocket으로 메시지 전송 시도:', JSON.stringify(message));
      wsRef.current.send(JSON.stringify(message));
      console.log('메시지 전송 성공');
      return true;
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');
      return false;
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setRecentMessage(null);
  };

  const clearError = () => {
    setError(null);
  };



  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    // 상태
    status,
    isConnecting: status === SOCKET_STATUS.CONNECTING,
    isConnected: status === SOCKET_STATUS.CONNECTED,
    messages,
    error,
    recentMessage,
    
    // 함수
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    clearError,
    setError
  };
};
