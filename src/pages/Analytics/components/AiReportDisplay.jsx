import {
  Eye,
  FileText,
  Heart,
  Info,
  Lightbulb,
  Tag
} from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Alert, LoadingSpinner} from '../../../components';

/**
 * AI 분석 보고서 표시 컴포넌트
 * @param {Object} props
 * @param {string} props.snsType - SNS 타입 (instagram, youtube, tiktok)
 * @param {number} props.postId - 게시물 ID
 * @param {Object} props.report - AI 보고서 데이터
 * @param {boolean} props.loading - 로딩 상태
 * @param {Error} props.error - 에러 객체
 * @param {Function} props.onRefresh - 새로고침 함수
 * @param {Function} props.onReset - 초기화 함수
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export const AiReportDisplay = ({
                                  report,
                                  loading,
                                  error,
                                  className = ''
                                }) => {

  const renderMarkdownContent = (markdownText) => {
    if (!markdownText) return null;

    return (
      <div
        className="markdown-content prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => (
              <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({children}) => (
              <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                {children}
              </h2>
            ),
            h3: ({children}) => (
              <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">
                {children}
              </h3>
            ),
            p: ({children}) => (
              <p className="text-gray-600 leading-relaxed mb-3">
                {children}
              </p>
            ),
            ul: ({children}) => (
              <ul className="list-disc list-inside text-gray-600 mb-3 space-y-1">
                {children}
              </ul>
            ),
            ol: ({children}) => (
              <ol className="list-decimal list-inside text-gray-600 mb-3 space-y-1">
                {children}
              </ol>
            ),
            li: ({children}) => (
              <li className="text-gray-600">
                {children}
              </li>
            ),
            strong: ({children}) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            em: ({children}) => (
              <em className="italic text-gray-700">
                {children}
              </em>
            ),
            code: ({children}) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ),
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            table: ({children}) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({children}) => (
              <thead className="bg-gray-50">
              {children}
              </thead>
            ),
            tbody: ({children}) => (
              <tbody className="bg-white">
              {children}
              </tbody>
            ),
            tr: ({children}) => (
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                {children}
              </tr>
            ),
            th: ({children}) => (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                {children}
              </th>
            ),
            td: ({children}) => (
              <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                {children}
              </td>
            ),
          }}
        >
          {markdownText}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={`ai-report-display ${className}`}>
      <div className="p-8">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg"/>
              <p className="mt-4 text-gray-600 font-medium">AI 분석 보고서를 생성하고 있습니다...</p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <Alert
            type="error"
            title="AI 분석 보고서 조회 실패"
            message={error.status + ' ' + error.message || 'AI 분석 보고서를 조회하는 중 오류가 발생했습니다.'}
            className="mb-4"
          />
        )}

        {/* 보고서 내용 */}
        {report && !loading && (
          <div>
            <div
              className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 mb-6 border border-purple-200/50">
              <div className="flex items-center space-x-2 text-sm text-purple-700">
                <Info className="text-purple-600"/>
                <span className="font-medium">게시물 ID: {report.postId}</span>
                <span>•</span>
                <span>AI 분석 결과</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700">
                {renderMarkdownContent(report.markdownReport)}
              </div>
            </div>
          </div>
        )}

        {/* 초기 상태 */}
        {!report && !loading && !error && (
          <div className="text-center py-12">
            <div
              className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-3xl text-purple-600"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI 분석 보고서</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              AI 분석 보고서를 생성하여 게시물의 상세한 분석 결과를 확인하세요.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Eye className="text-purple-500"/>
                <span>조회수, 좋아요 분석</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="text-red-500"/>
                <span>감정 분석 결과</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="text-green-500"/>
                <span>주요 키워드 추출</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="text-yellow-500"/>
                <span>AI 기반 인사이트</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
