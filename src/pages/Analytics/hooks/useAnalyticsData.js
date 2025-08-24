import { useEffect, useState } from 'react';
import { analyticsApi } from '../../../api/analytics';
import { contentApi } from '../../../api/content';
import { snsApi } from '../../../api/sns';
import { useMultipleApi } from '../../../hooks';
import { createStatCard } from '../components';

// 테스트용 임시 데이터
const TEST_SNS_TYPES = ['YOUTUBE', 'INSTAGRAM', 'TIKTOK'];
const TEST_POST_IDS = [1, 2, 3];

export const useAnalyticsData = () => {
  const [dateRange, setDateRange] = useState('last7');
  const [overviewStats, setOverviewStats] = useState([]);
  const [contentPerformance, setContentPerformance] = useState([]);
  const [commentSentiment, setCommentSentiment] = useState([]);
  const [emotionAnalysis, setEmotionAnalysis] = useState(null);
  const [followerTrend, setFollowerTrend] = useState({});
  const [optimalPostingTime, setOptimalPostingTime] = useState({});
  
  // useMultipleApi 훅 사용
  const { 
    loading, 
    error, 
    errors, 
    results, 
    executeAllSettled 
  } = useMultipleApi();

  useEffect(() => {
    if (!loading) {
      fetchAnalyticsData();
    }
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      console.log('🔄 fetchAnalyticsData 시작');

      const yesterdayStr = getYesterdayString();
      console.log('📅 어제 날짜:', yesterdayStr);

      // 사용자 데이터 가져오기 - 올바른 API 함수 사용
      const userDataResult = await executeAllSettled({
        accounts: () => snsApi.post.getPosts(), // SNS 포스트 목록으로 계정 정보 대체
        contents: () => contentApi.getContents()
      });

      console.log('📱 SNS 포스트 응답:', userDataResult.results.accounts);
      console.log('📄 콘텐츠 응답:', userDataResult.results.contents);
      console.log('❌ 사용자 데이터 에러들:', userDataResult.errors);

      // 사용자 데이터 에러 체크
      if (userDataResult.errors.accounts || userDataResult.errors.contents) {
        console.error('❌ 사용자 데이터 로드 실패');
        return;
      }

      const posts = userDataResult.results.accounts?.data?.result || [];
      const contents = userDataResult.results.contents?.data?.result || [];

      console.log('📝 SNS 포스트 데이터:', posts);
      console.log('📄 콘텐츠 데이터:', contents);

      // 포스트와 콘텐츠에서 ID와 SNS 타입 추출
      const postIds = posts.map(post =>
        post.id || post.postId || post.contentId
      ).filter(Boolean);

      const contentIds = contents.map(content =>
        content.id || content.contentId
      ).filter(Boolean);

      // SNS 타입 추출 (실제 데이터에서 추출하거나 기본값 사용)
      const snsTypes = posts.map(post => post.snsType || 'YOUTUBE').filter(Boolean);
      const uniqueSnsTypes = [...new Set(snsTypes)];

      // 테스트용 임시 데이터 (실제 데이터가 없을 때)
      if (postIds.length === 0 && contentIds.length === 0) {
        console.log('🧪 테스트용 임시 데이터 사용');
        setDefaultStats();
        await loadOtherData(uniqueSnsTypes, yesterdayStr);
        return;
      }

      console.log('🆔 추출된 포스트 ID들:', postIds);
      console.log('🆔 추출된 콘텐츠 ID들:', contentIds);
      console.log('📱 추출된 SNS 타입들:', uniqueSnsTypes);

      // 메트릭 데이터 가져오기
      await fetchMetricsData(postIds, contentIds, uniqueSnsTypes, yesterdayStr);

    } catch (error) {
      console.error('❌ 분석 데이터 로딩 실패:', error);
    }
  };

  const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const fetchMetricsData = async (postIds, contentIds, snsTypes, yesterdayStr) => {
    console.log('🚀 메트릭 데이터 가져오기 시작', postIds, contentIds, snsTypes, yesterdayStr);
    
    // 실시간 메트릭과 히스토리 메트릭을 동시에 가져오기
    const metricsCalls = {};
    
    // 실시간 계정 메트릭 (SNS 타입별로)
    snsTypes.forEach(snsType => {
      metricsCalls[`realtime_account_${snsType}`] = () => 
        analyticsApi.getRealtimeAccountMetrics(snsType);
    });
    
    // 실시간 게시물 메트릭 - 포스트와 콘텐츠 모두 사용
    postIds.forEach((id, index) => {
      const snsType = snsTypes[index] || snsTypes[0] || 'YOUTUBE';
      metricsCalls[`realtime_post_${id}`] = () => 
        analyticsApi.getRealtimePostMetrics(snsType, id);
    });
    contentIds.forEach((id, index) => {
      const snsType = snsTypes[index] || snsTypes[0] || 'YOUTUBE';
      metricsCalls[`realtime_content_${id}`] = () => 
        analyticsApi.getRealtimePostMetrics(snsType, id); // 콘텐츠도 포스트 메트릭 사용
    });
    
    // 히스토리 계정 메트릭 (SNS 타입별로)
    snsTypes.forEach(snsType => {
      metricsCalls[`history_account_${snsType}`] = () => 
        analyticsApi.getHistoryAccountMetrics(yesterdayStr, snsType);
    });
    
    // 히스토리 게시물 메트릭
    postIds.forEach((id, index) => {
      const snsType = snsTypes[index] || snsTypes[0] || 'YOUTUBE';
      metricsCalls[`history_post_${id}`] = () => 
        analyticsApi.getHistoryPostMetrics(yesterdayStr, snsType, id);
    });
    contentIds.forEach((id, index) => {
      const snsType = snsTypes[index] || snsTypes[0] || 'YOUTUBE';
      metricsCalls[`history_content_${id}`] = () => 
        analyticsApi.getHistoryPostMetrics(yesterdayStr, snsType, id);
    });

    const metricsResult = await executeAllSettled(metricsCalls);
    
    console.log('📊 메트릭 결과:', metricsResult.results);
    console.log('❌ 메트릭 에러들:', metricsResult.errors);

    // 실시간 데이터와 히스토리 데이터 분리
    const realtimeData = aggregateMetrics(
      Object.entries(metricsResult.results)
        .filter(([key]) => key.startsWith('realtime_'))
        .map(([_, response]) => response)
    );
    
    const yesterdayData = aggregateMetrics(
      Object.entries(metricsResult.results)
        .filter(([key]) => key.startsWith('history_'))
        .map(([_, response]) => response)
    );

    console.log('📊 실시간 데이터:', realtimeData);
    console.log('📊 어제 데이터:', yesterdayData);

    const stats = createOverviewStats(realtimeData, yesterdayData);
    console.log('📈 생성된 통계:', stats);

    setOverviewStats(stats);
    await loadOtherData(snsTypes, yesterdayStr);
  };

  const aggregateMetrics = (responses) => {
    // 마지막 유효한 응답만 사용
    const lastValidResponse = responses
      .filter(response => response.data?.result)
      .pop();

    if (!lastValidResponse) {
      return {views: 0, likes: 0, comments: 0};
    }

    const result = lastValidResponse.data.result;

    // 새로운 DTO 구조에 맞게 처리
    if (result['@class']) {
      // 단일 객체 응답 (새로운 DTO 구조)
      return {
        views: parseInt(result.views) || 0,
        likes: parseInt(result.likes) || 0,
        comments: parseInt(result.comments) || 0
      };
    } else if (Array.isArray(result)) {
      // 배열 응답 (기존 구조)
      const lastItem = result[0];
      return {
        views: parseInt(lastItem.views) || 0,
        likes: parseInt(lastItem.likes) || 0,
        comments: parseInt(lastItem.comments) || 0
      };
    } else {
      // 단일 객체 응답 (기존 구조)
      return {
        views: parseInt(result.views) || 0,
        likes: parseInt(result.likes) || 0,
        comments: parseInt(result.comments) || 0
      };
    }
  };

  const createOverviewStats = (realtimeData, yesterdayData) => {
    return [
      createStatCard('views', realtimeData.views, yesterdayData.views),
      createStatCard('likes', realtimeData.likes, yesterdayData.likes),
      createStatCard('comments', realtimeData.comments, yesterdayData.comments),
    ];
  };

  const setDefaultStats = () => {
    setOverviewStats([
      createStatCard('views', 0, 0),
      createStatCard('likes', 0, 0),
      createStatCard('comments', 0, 0),
    ]);
  };

  const loadOtherData = async (snsTypes, yesterdayStr) => {
    try {
      const otherDataResult = await executeAllSettled({
        performance: () => analyticsApi.getContentPerformance({dateRange}),
        sentiment: () => analyticsApi.getCommentSentiment({dateRange}),
        trend: () => analyticsApi.getFollowerTrend({dateRange}),
        postingTime: () => analyticsApi.getOptimalPostingTime(),
        // 새로운 감정분석 API 호출
        emotionAnalysis: () => analyticsApi.getHistoryEmotionAnalysis(
          yesterdayStr, 
          snsTypes[0] || 'YOUTUBE'
        )
      });

      console.log('📊 추가 데이터 결과:', otherDataResult.results);
      console.log('❌ 추가 데이터 에러들:', otherDataResult.errors);

      setContentPerformance(otherDataResult.results.performance?.data?.result || []);
      setCommentSentiment(otherDataResult.results.sentiment?.data?.result || []);
      setFollowerTrend(otherDataResult.results.trend?.data?.result || {});
      setOptimalPostingTime(otherDataResult.results.postingTime?.data?.result || {});
      
      // 새로운 감정분석 데이터 설정
      const emotionData = otherDataResult.results.emotionAnalysis?.data?.result;
      if (emotionData) {
        setEmotionAnalysis(emotionData);
      }
    } catch (error) {
      console.error('❌ 추가 데이터 로드 실패:', error);
    }
  };

  return {
    dateRange,
    setDateRange,
    overviewStats,
    contentPerformance,
    commentSentiment,
    emotionAnalysis,
    followerTrend,
    optimalPostingTime,
    loading,
    error,
    errors // 개별 API 에러들도 노출
  };
};
