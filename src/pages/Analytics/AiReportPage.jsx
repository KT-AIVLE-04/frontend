import {
  AlertCircle,
  BarChart3,
  Brain,
  RefreshCw
} from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { analyticsApi } from '../../api/analytics';
import { Button } from '../../components/atoms';
import { Card } from '../../components/molecules';
import { useApi } from '../../hooks';
import { AiReportDisplay } from './components/AiReportDisplay';

/**
 * AI 분석 보고서 전용 페이지
 * URL 파라미터: snsType, postId
 */
export const AiReportPage = () => {
  const { snsType, postId } = useParams();
  const navigate = useNavigate();

  const { 
    data: report, 
    loading, 
    error, 
    execute: getReport, 
    reset 
  } = useApi(analyticsApi.getAiReport, {
    autoExecute: true,
    autoExecuteArgs: [snsType, postId],
    onSuccess: (data, message) => {
      console.log('AI 보고서 조회 성공:', data);
    },
    onError: (error) => {
      console.error('AI 보고서 조회 실패:', error);
    }
  });

  const handleRefresh = () => {
    getReport(snsType, postId);
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
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                새로고침
              </Button>
              
              <Button 
                onClick={() => navigate('/analytics')} 
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <BarChart3 className="mr-2 w-4 h-4" />
                성과분석
              </Button>
            </div>
          </div>
        </div>

        {/* AI 보고서 컴포넌트 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
          <AiReportDisplay 
            snsType={snsType} 
            postId={parseInt(postId)}
            report={report}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onReset={reset}
            className="p-0"
          />
        </div>
      </div>
    </div>
  );
};
