import {
  AlertCircle,
  BarChart3,
  Brain,
  Play
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/atoms';
import { Card, WebSocketStatus } from '../../components/molecules';
import { useWebSocket } from '../../hooks';
import { AiReportDisplay } from './components/AiReportDisplay';

/**
 * WebSocket 기반 AI 분석 보고서 페이지
 * 실시간으로 보고서 생성을 진행하고 결과를 표시
 */
export const AiReportWebSocketPage = () => {
  const { snsType, postId } = useParams();
  const navigate = useNavigate();
  const { selectedStoreId } = useSelector(state => state.auth);
  const { connections } = useSelector(state => state.sns);
  
  const {
    isConnecting,
    isConnected,
    messages,
    error,
    recentMessage,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    clearError
  } = useWebSocket('/api/analytics/report');

  // 컴포넌트 마운트 시 WebSocket 연결
  useEffect(() => {
    if (selectedStoreId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []); // 한 번만 실행

  // WebSocket 연결 성공 시 자동으로 분석 시작
  useEffect(() => {
    if (isConnected && selectedStoreId && connections[snsType]?.accountInfo?.id) {
      // 연결이 완료되고 필요한 정보가 있으면 자동으로 분석 시작
      console.log('WebSocket 연결 성공 시 자동으로 분석 시작');
      const accountId = connections[snsType]?.accountInfo?.id;
      const request = {
        action: 'generate_report',
        postId: parseInt(postId),
        accountId,
        storeId: selectedStoreId
      };
      sendMessage(request);
    }
  }, [isConnected, selectedStoreId, connections, snsType, postId]); // sendMessage 제거

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
              <AlertCircle className="mx-auto mb-4 text-4xl text-red-500" />
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
                  <div className="w-10 h-10 bg-gradient-to-r from-[#984fff] to-purple-600 rounded-lg flex items-center justify-center pr-1">
                    <Brain className="text-white text-lg" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-0!">
                      AI 분석 보고서 (실시간)
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
                isConnecting={isConnecting} 
                isConnected={isConnected} 
                onDisconnect={handleStopGeneration}
              />
              <Button 
                onClick={() => navigate('/analytics')} 
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <BarChart3 className="mr-2 w-4 h-4" />
                성과분석으로 돌아가기
              </Button>
            </div>
          </div>
        </div>

        {/* WebSocket 상태 및 진행률 표시 */}
        {recentMessage && recentMessage.type === 'PROGRESS' && (
          <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="text-center">
              {/* 로딩 인디케이터 */}
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              
              {/* 제목 */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI 분석 진행 중...
              </h3>
              
              {/* 메시지 */}
              <p className="text-gray-600 text-lg">
                {recentMessage?.message || '분석을 진행하고 있습니다...'}
              </p>
            </div>
          </div>
        )}

        {/* 오류 표시 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">오류 발생</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <Button onClick={handleStopGeneration} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                재연결
              </Button>
            </div>
          </div>
        )}

        {/* AI 보고서 컴포넌트 */}
        {recentMessage && recentMessage.type === 'COMPLETE' && recentMessage.result && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
            <AiReportDisplay 
              snsType={snsType} 
              postId={parseInt(postId)}
              report={recentMessage.result}
              loading={false}
              error={null}
              onRefresh={connect}
              onReset={clearMessages}
              className="p-0"
            />
          </div>
        )}

        {/* 초기 상태 또는 연결 대기 */}
        {!recentMessage && !error && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI 분석 보고서 생성
              </h3>
              <p className="text-gray-600 mb-6">
                {isConnecting 
                  ? 'WebSocket 연결을 시도하고 있습니다...'
                  : '분석 시작 버튼을 클릭하여 AI 분석을 시작하세요.'
                }
              </p>
              {!isConnecting && (
                <Button 
                  onClick={connect}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Play className="mr-2 w-4 h-4" />
                  분석 시작
                </Button>
              )}
            </div>
          </div>
        )}

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
