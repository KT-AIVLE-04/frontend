import {
  AlertCircle,
  BarChart3,
  Brain
} from 'lucide-react';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, WebSocketStatus, Button} from '../../components';
import {SOCKET_STATUS} from '../../const/socketType';
import {useWebSocket} from '../../hooks';
import {AiReportStatusDisplay} from './components/AiReportStatusDisplay';

/**
 * WebSocket 기반 AI 분석 보고서 페이지
 * 실시간으로 보고서 생성을 진행하고 결과를 표시
 */
export const AiReportWebSocketPage = () => {
  const {snsType, postId} = useParams();
  const navigate = useNavigate();
  const {selectedStoreId} = useSelector(state => state.auth);
  const {connections} = useSelector(state => state.sns);

  const {
    status,
    messages,
    error,
    recentMessage,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    clearError,
    setError
  } = useWebSocket('/api/analytics/report', {
    onOpen: () => {
      // WebSocket 연결 성공 시 자동으로 분석 시작
      console.log('onOpen 콜백 실행됨');
      console.log('selectedStoreId:', selectedStoreId);
      console.log('connections[snsType]:', connections[snsType]);
      console.log('connections[snsType]?.accountInfo?.id:', connections[snsType]?.accountInfo?.id);

      if (selectedStoreId && connections[snsType]?.accountInfo?.id) {
        console.log('WebSocket 연결 성공 시 자동으로 분석 시작');
        const accountId = connections[snsType]?.accountInfo?.id;
        const request = {
          action: 'generate_report',
          postId: parseInt(postId),
          accountId,
          storeId: selectedStoreId
        };
        console.log('전송할 메시지:', request);
        const result = sendMessage(request);
        console.log('sendMessage 결과:', result);
      } else {
        console.log('자동 분석 시작 조건 불충족');
        console.log('- selectedStoreId:', selectedStoreId);
        console.log('- connections[snsType]:', connections[snsType]);
      }
    },
    onClose: (event) => {
      // 연결이 끊어졌을 때 진행사항 확인
      if (!recentMessage || recentMessage.type !== 'COMPLETE') {
        // 진행사항이 완료되지 않았다면 에러 표시
        console.log('event:', event);
        console.log('WebSocket 연결이 예기치 않게 끊어졌습니다. 분석이 완료되지 않았을 수 있습니다.');
        setError('WebSocket 연결이 예기치 않게 끊어졌습니다. 분석이 완료되지 않았을 수 있습니다.');
      }
    }
  });

  // 컴포넌트 마운트 시 WebSocket 연결
  useEffect(() => {
    if (selectedStoreId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []); // 한 번만 실행

  // COMPLETE 메시지가 오면 자동으로 연결 해제
  useEffect(() => {
    if (recentMessage && recentMessage.type === 'COMPLETE') {
      disconnect();
    }
  }, [recentMessage]); // recentMessage만 의존성

  const handleStopGeneration = () => {
    disconnect();
    clearMessages();
    clearError();
    connect(); // 재연결
  };

  if (!snsType || !postId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="mx-auto mb-4 text-4xl text-red-500"/>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                잘못된 접근
              </h2>
              <p className="text-gray-600 mb-6">
                SNS 타입과 게시물 ID가 필요합니다.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate('/analytics')} className="bg-purple-600 hover:bg-purple-700">
                  분석 페이지로
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-10 h-10 bg-gradient-to-r from-[#984fff] to-purple-600 rounded-lg flex items-center justify-center pr-1">
                    <Brain className="text-white text-lg"/>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-0!">
                      AI 분석 보고서
                    </h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {snsType.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>게시물 #{postId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 영역 */}
            <div className="flex items-center space-x-3">
              {/* WebSocket 상태 표시 */}
              <WebSocketStatus
                isConnecting={status === SOCKET_STATUS.CONNECTING}
                isConnected={status === SOCKET_STATUS.CONNECTED}
                onDisconnect={handleStopGeneration}
              />
              <Button
                onClick={() => navigate('/analytics')}
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <BarChart3 className="mr-2 w-4 h-4"/>
                성과분석으로 돌아가기
              </Button>
            </div>
          </div>
        </div>

        {/* AI 보고서 상태별 UI 표시 */}
        <AiReportStatusDisplay
          status={status}
          recentMessage={recentMessage}
          error={error}
          snsType={snsType}
          postId={postId}
          onConnect={connect}
          onStopGeneration={handleStopGeneration}
          onClearMessages={clearMessages}
        />

        {/* 디버그용 메시지 로그 (개발 환경에서만) */}
        {import.meta.env.DEV && messages.length > 0 && (
          <div className="mt-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
            <h4 className="text-white mb-2">WebSocket 메시지 로그:</h4>
            <div className="max-h-40 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-blue-400"> {msg.type}:</span>
                  <span className="ml-2">{JSON.stringify(msg)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
