import { useCallback, useEffect, useRef, useState } from 'react';

export const useWebSocket = (path = '') => {
  const wsRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [recentMessage, setRecentMessage] = useState(null);

  const connect = useCallback(() => {


    if (isConnecting || isConnected) {
      return; // 이미 연결 중이거나 연결된 상태
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 환경변수 VITE_API_DOMAIN 사용, wss 프로토콜 사용
      const domain = import.meta.env.VITE_API_DOMAIN || 'localhost';
      const wsUrl = `wss://${domain}${path}`;
      
      console.log('WebSocket 연결 시도:', domain , path);
      
      // 헤더 없이 WebSocket 연결
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket 연결됨');
        setIsConnecting(false);
        setIsConnected(true);
        setError(null);
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
        setIsConnecting(false);
        setError('WebSocket 연결 오류가 발생했습니다.');
      };

      ws.onclose = (event) => {
        console.log('WebSocket 연결 종료:', event.code, event.reason);
        setIsConnecting(false);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('WebSocket 연결 실패:', err);
      setIsConnecting(false);
      setError('WebSocket 연결에 실패했습니다.');
    }
  }, [path]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnecting(false);
    setIsConnected(false);
  }, []);

  const sendMessage = (message) => {
    if (!wsRef.current || !isConnected) {
      setError('WebSocket이 연결되지 않았습니다.');
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(message));
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
    isConnecting,
    isConnected,
    messages,
    error,
    recentMessage,
    
    // 함수
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    clearError
  };
};
