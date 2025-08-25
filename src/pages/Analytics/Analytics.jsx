import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsApi } from '../../api/analytics';
import { contentApi } from '../../api/content';
import { snsApi } from '../../api/sns';
import { Alert, ErrorPage, LoadingSpinner } from '../../components';
import { useMultipleApi } from '../../hooks';
import { fetchSnsAccount } from '../../store/snsSlice';
import {
  ApiErrorDisplay,
  CommentsDisplay,
  ComparisonStats,
  ContentPerformanceTable,
  DateRangeSelector,
  EmotionAnalysis,
  PostSelector
} from './components';

export function Analytics() {
  const dispatch = useDispatch();
  const { selectedStoreId } = useSelector((state) => state.auth);
  const { connections } = useSelector((state) => state.sns);
  const [dateRange, setDateRange] = useState("last7");
  const [selectedSnsType, setSelectedSnsType] = useState("youtube");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [contents, setContents] = useState([]);
  
  // 비교 기간 설정
  const [comparisonPeriod, setComparisonPeriod] = useState("yesterday"); // yesterday, week, month
  
  const { loading, error, errors, results, executeMultiple } = useMultipleApi(
    {}, // 기본 API 함수들 (현재는 비어있음)
    {
      autoExecute: true,
      initialApiFunctions: {
        // 초기 실행할 API 함수들
        posts: () => snsApi.post.getPosts(),
        contents: () => contentApi.getContents()
      },
      onSuccess: (results, messages) => {
        const { posts, contents } = results;
        if (posts?.result) {
          setPosts(posts.result || []);
        }
        if (contents?.result) {
          setContents(contents.result || []);
        }
        
        // 첫 번째 포스트를 기본 선택
        if (posts?.result && posts.result.length > 0) {
          setSelectedPostId(posts.result[0].id || posts.result[0].postId);
        }
      },
      onError: (errors) => {
        console.error('사용자 데이터 로드 실패:', errors);
      }
    }
  );

  // SNS 계정 정보 가져오기
  useEffect(() => {
    if (!selectedSnsType) return;
    
    // Redux store에서 SNS 계정 정보 가져오기
    dispatch(fetchSnsAccount(selectedSnsType));
  }, [selectedSnsType, dispatch]);

  // 주기적으로 SNS 계정 상태 확인 (5분마다)
  useEffect(() => {
    if (!selectedSnsType) return;

    const interval = setInterval(() => {
      dispatch(fetchSnsAccount(selectedSnsType));
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [selectedSnsType, dispatch]);

  // 날짜 계산 헬퍼
  const getDateString = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };



  // 현재 선택된 SNS 계정 정보
  const currentConnection = connections[selectedSnsType];
  const accountId = currentConnection?.accountInfo?.id;

  // 분석 데이터 로드
  useEffect(() => {
    if (!accountId) return;

    const loadAnalyticsData = async () => {
      const yesterday = getDateString(1);
      const weekAgo = getDateString(7);
      const monthAgo = getDateString(30);

      const apiCalls = {
        // 실시간 계정 메트릭
        realtimeAccount: () => analyticsApi.getRealtimeAccountMetrics(accountId),
        
        // 히스토리 계정 메트릭 (어제)
        historyAccountYesterday: () => analyticsApi.getHistoryAccountMetrics(yesterday, accountId),
        
        // 히스토리 계정 메트릭 (1주일 전)
        historyAccountWeek: () => analyticsApi.getHistoryAccountMetrics(weekAgo, accountId),
        
        // 히스토리 계정 메트릭 (1달 전)
        historyAccountMonth: () => analyticsApi.getHistoryAccountMetrics(monthAgo, accountId),
      };

      // 선택된 게시물이 있는 경우 게시물 메트릭도 로드
      if (selectedPostId) {
        apiCalls.realtimePost = () => analyticsApi.getRealtimePostMetrics(accountId, selectedPostId);
        apiCalls.historyPostYesterday = () => analyticsApi.getHistoryPostMetrics(yesterday, accountId, selectedPostId);
        apiCalls.historyPostWeek = () => analyticsApi.getHistoryPostMetrics(weekAgo, accountId, selectedPostId);
        apiCalls.historyPostMonth = () => analyticsApi.getHistoryPostMetrics(monthAgo, accountId, selectedPostId);
        
        // 게시물 댓글
        apiCalls.realtimeComments = () => analyticsApi.getRealtimeComments(accountId, selectedPostId, 0, 5);
        apiCalls.historyComments = () => analyticsApi.getHistoryComments(yesterday, accountId, selectedPostId, 0, 5);
        
        // 게시물 감정분석
        apiCalls.emotionAnalysis = () => analyticsApi.getHistoryEmotionAnalysis(yesterday, accountId, selectedPostId);
      }

      // 콘텐츠 성과 데이터
      apiCalls.contentPerformance = () => analyticsApi.getContentPerformance({ dateRange });

      await executeMultiple(apiCalls);
    };

    loadAnalyticsData();
  }, [accountId, selectedPostId, dateRange]);

  if (loading && Object.keys(results).length === 0) {
    return <LoadingSpinner />;
  }

  // SNS 계정 연결 상태 확인
  if (currentConnection?.loading) {
    return <LoadingSpinner message="SNS 계정 정보를 불러오는 중..." />;
  }

  // SNS 계정이 연결되지 않은 경우
  if (currentConnection?.status === 'disconnected') {
    return (
      <div className="flex-1 w-full p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 shadow-lg">
            <div className="text-yellow-600 text-6xl mb-4 animate-bounce">🔗</div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              SNS 계정 연결이 필요합니다
            </h2>
            <p className="text-yellow-700 mb-6 text-lg">
              {selectedSnsType === 'youtube' ? 'YouTube' : selectedSnsType === 'instagram' ? 'Instagram' : 'Facebook'} 계정을 연결해야 분석 데이터를 확인할 수 있습니다.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/sns-integration'}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                SNS 계정 연결하기
              </button>
              <div className="text-sm text-yellow-600">
                연결 후 분석 데이터를 실시간으로 확인할 수 있습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SNS 계정 연결 에러
  if (currentConnection?.status === 'error') {
    return (
      <div className="flex-1 w-full p-6">
        <div className="max-w-2xl mx-auto">
          <Alert
            type="error"
            title="SNS 계정 연결 오류"
            message={currentConnection.error || 'SNS 계정 정보를 불러오는 중 오류가 발생했습니다.'}
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => dispatch(fetchSnsAccount(selectedSnsType))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // accountId가 없으면 로딩 표시
  if (!accountId) {
    return <LoadingSpinner message="분석 데이터를 준비하는 중..." />;
  }

  // 전체 에러가 있는 경우
  if (error && Object.keys(errors || {}).length > 0) {
    return <ErrorPage title="분석 데이터 로딩 실패" message={error} />;
  }

  return (
    <div className="flex-1 w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">성과 분석</h1>
          {currentConnection?.accountInfo && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <span className="mr-2">
                {selectedSnsType === 'youtube' ? '🎥' : selectedSnsType === 'instagram' ? '📷' : '📱'}
              </span>
              <span className="font-medium">
                {currentConnection.accountInfo.channelName || currentConnection.accountInfo.accountName || '연결된 계정'}
              </span>
              <span className="mx-2">•</span>
              <span className="text-green-600 font-medium">연결됨</span>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>

      {/* 개별 API 에러 표시 */}
      <ApiErrorDisplay errors={errors} />

      {/* SNS 타입 및 게시물 선택 */}
      <div className="mb-6">
        <PostSelector
          selectedSnsType={selectedSnsType}
          setSelectedSnsType={setSelectedSnsType}
          selectedPostId={selectedPostId}
          setSelectedPostId={setSelectedPostId}
          posts={posts}
          contents={contents}
          connectionStatus={connections}
        />
      </div>

      {/* 비교 기간 선택 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setComparisonPeriod("yesterday")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "yesterday"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            어제와 비교
          </button>
          <button
            onClick={() => setComparisonPeriod("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            1주일 전과 비교
          </button>
          <button
            onClick={() => setComparisonPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            1달 전과 비교
          </button>
        </div>
      </div>

      {/* 계정 메트릭 비교 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 성과</h2>
        <ComparisonStats
          realtimeData={results.realtimeAccount}
          historyData={results[`historyAccount${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`]}
          comparisonPeriod={comparisonPeriod}
          type="account"
        />
      </div>

      {/* 게시물 메트릭 (게시물이 선택된 경우) */}
      {selectedPostId && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">게시물 성과</h2>
          <ComparisonStats
            realtimeData={results.realtimePost}
            historyData={results[`historyPost${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`]}
            comparisonPeriod={comparisonPeriod}
            type="post"
          />
        </div>
      )}

      {/* 감정분석 및 댓글 */}
      {selectedPostId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EmotionAnalysis emotionAnalysis={results.emotionAnalysis} />
          <CommentsDisplay
            realtimeComments={results.realtimeComments}
            historyComments={results.historyComments}
            comparisonPeriod={comparisonPeriod}
          />
        </div>
      )}

      {/* 콘텐츠 성과 테이블 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과</h2>
        <ContentPerformanceTable contentPerformance={results.contentPerformance} />
      </div>

      {/* 데이터가 없는 경우 안내 */}
      {Object.keys(results).length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">분석 데이터가 없습니다</h3>
            <p className="text-gray-500 text-sm mb-4">
              게시물을 선택하거나 날짜 범위를 조정해보세요
            </p>
            <div className="text-xs text-gray-400">
              실시간 데이터는 외부 API에서 가져오므로 시간이 걸릴 수 있습니다
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 