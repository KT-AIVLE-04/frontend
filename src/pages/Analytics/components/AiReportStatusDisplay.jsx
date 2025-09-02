import { AlertCircle, Brain, Play } from 'lucide-react';
import React from 'react';
import { Button } from '../../../components';
import { AiReportDisplay } from './AiReportDisplay';

export function AiReportStatusDisplay({
  status,
  recentMessage,
  error,
  snsType,
  postId,
  onConnect,
  onStopGeneration,
  onClearMessages
}) {
  

  // 오류 상태
  if (error) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">오류 발생</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <Button onClick={onStopGeneration} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            재연결
          </Button>
        </div>
      </div>
    );
  }
// 진행 중 상태
if (recentMessage && recentMessage.type === 'PROGRESS') {
    return (
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
    );
  }
  // 완료 상태
  if (recentMessage && recentMessage.type === 'COMPLETE' && recentMessage.result) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
        <AiReportDisplay 
          snsType={snsType} 
          postId={parseInt(postId)}
          report={recentMessage.result}
          loading={false}
          error={null}
          onRefresh={onConnect}
          onReset={onClearMessages}
          className="p-0"
        />
      </div>
    );
  }

  // 초기 상태 또는 연결 대기
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          AI 분석 보고서 생성
        </h3>
        <p className="text-gray-600 mb-6">
          {status === 'CONNECTING' 
            ? 'WebSocket 연결을 시도하고 있습니다...'
            : '분석 시작 버튼을 클릭하여 AI 분석을 시작하세요.'
          }
        </p>
        {status !== 'CONNECTING' && (
          <Button 
            onClick={onConnect}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="mr-2 w-4 h-4" />
            분석 시작
          </Button>
        )}
      </div>
    </div>
  );
}
