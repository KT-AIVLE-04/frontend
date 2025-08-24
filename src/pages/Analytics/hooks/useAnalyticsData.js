import {useEffect, useState} from 'react';
import {analyticsApi} from '../../../api/analytics';
import {contentApi} from '../../../api/content';
import {snsApi} from '../../../api/sns';
import {useMultipleApi} from '../../../hooks';
import {StatCardCreator} from '../components';

// 테스트용 임시 데이터

export const useAnalyticsData = () => {
  const [dateRange, setDateRange] = useState('last7');
  const [overviewStats, setOverviewStats] = useState([]);
  const [contentPerformance, setContentPerformance] = useState([]);
  const [commentSentiment, setCommentSentiment] = useState([]);
  const [followerTrend, setFollowerTrend] = useState({});
  const [optimalPostingTime, setOptimalPostingTime] = useState({});

  // useMultipleApi 훅 사용
  const {
    loading,
    error,
    errors,
    results,
    executeMultiple
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
      await executeMultiple({
        accounts: () => snsApi.post.getPosts(), // SNS 포스트 목록으로 계정 정보 대체
        contents: () => contentApi.getContents()
      });

      console.log('📱 SNS 포스트 응답:', results.accounts);
      console.log('📄 콘텐츠 응답:', results.contents);
      console.log('❌ 사용자 데이터 에러들:', errors);

      // 사용자 데이터 에러 체크
      if (errors.accounts || errors.contents) {
        console.error('❌ 사용자 데이터 로드 실패:', errors);
        // 에러가 있어도 기본값으로 계속 진행
        setDefaultStats();
        await loadOtherData();
        return;
      }

      const posts = results.accounts || [];
      const contents = results.contents || [];

      console.log('📝 SNS 포스트 데이터:', posts);
      console.log('📄 콘텐츠 데이터:', contents);

      // 포스트와 콘텐츠에서 ID 추출
      const postIds = posts.map(post =>
        post.id || post.postId || post.contentId
      ).filter(Boolean);

      const contentIds = contents.map(content =>
        content.id || content.contentId
      ).filter(Boolean);

      // 테스트용 임시 데이터 (실제 데이터가 없을 때)
      if (postIds.length === 0 && contentIds.length === 0) {
        console.log('🧪 테스트용 임시 데이터 사용');
        setDefaultStats();
        await loadOtherData();
        return;
      }

      console.log('🆔 추출된 포스트 ID들:', postIds);
      console.log('🆔 추출된 콘텐츠 ID들:', contentIds);

      // 메트릭 데이터 가져오기
      await fetchMetricsData(postIds, contentIds, yesterdayStr);

    } catch (error) {
      console.error('❌ 분석 데이터 로딩 실패:', error);
    }
  };

  const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const fetchMetricsData = async (postIds, contentIds, yesterdayStr) => {
    console.log('🚀 메트릭 데이터 가져오기 시작', postIds, contentIds, yesterdayStr);

    // 실시간 메트릭과 히스토리 메트릭을 동시에 가져오기
    const metricsCalls = {};

    // 실시간 메트릭 - 포스트와 콘텐츠 모두 사용
    postIds.forEach(id => {
      metricsCalls[`realtime_post_${id}`] = () => analyticsApi.getRealtimePostMetrics(id);
    });
    contentIds.forEach(id => {
      metricsCalls[`realtime_content_${id}`] = () => analyticsApi.getRealtimePostMetrics(id); // 콘텐츠도 포스트 메트릭 사용
    });

    // 히스토리 메트릭
    postIds.forEach(id => {
      metricsCalls[`history_post_${id}`] = () => analyticsApi.getHistoryPostMetrics(id, yesterdayStr);
    });
    contentIds.forEach(id => {
      metricsCalls[`history_content_${id}`] = () => analyticsApi.getHistoryPostMetrics(id, yesterdayStr);
    });

    await executeMultiple(metricsCalls);

    console.log('📊 메트릭 결과:', results);
    console.log('❌ 메트릭 에러들:', errors);

    // 실시간 데이터와 히스토리 데이터 분리
    const realtimeData = aggregateMetrics(
      Object.entries(results)
        .filter(([key]) => key.startsWith('realtime_'))
        .map(([, response]) => response)
    );

    const yesterdayData = aggregateMetrics(
      Object.entries(results)
        .filter(([key]) => key.startsWith('history_'))
        .map(([, response]) => response)
    );

    console.log('📊 실시간 데이터:', realtimeData);
    console.log('📊 어제 데이터:', yesterdayData);

    const stats = createOverviewStats(realtimeData, yesterdayData);
    console.log('📈 생성된 통계:', stats);

    setOverviewStats(stats);
    await loadOtherData();
  };

  const aggregateMetrics = (responses) => {
    // 마지막 유효한 응답만 사용
    const lastValidResponse = responses
      .filter(response => response && typeof response === 'object')
      .pop();

    if (!lastValidResponse) {
      console.log('⚠️ 유효한 메트릭 응답이 없습니다. 기본값 사용');
      return {views: 0, likes: 0, comments: 0};
    }

    console.log('📊 메트릭 응답 처리:', lastValidResponse);

    // result가 배열인 경우 마지막 항목만 사용
    if (Array.isArray(lastValidResponse)) {
      const lastItem = lastValidResponse[0] || {};
      return {
        views: parseInt(lastItem.views) || 0,
        likes: parseInt(lastItem.likes) || 0,
        comments: parseInt(lastItem.comments) || 0
      };
    } else {
      // result가 단일 객체인 경우
      return {
        views: parseInt(lastValidResponse.views) || 0,
        likes: parseInt(lastValidResponse.likes) || 0,
        comments: parseInt(lastValidResponse.comments) || 0
      };
    }
  };

  const createOverviewStats = (realtimeData, yesterdayData) => {
    return [
      StatCardCreator('views', realtimeData.views, yesterdayData.views),
      StatCardCreator('likes', realtimeData.likes, yesterdayData.likes),
      StatCardCreator('comments', realtimeData.comments, yesterdayData.comments),
    ];
  };

  const setDefaultStats = () => {
    setOverviewStats([
      StatCardCreator('views', 0, 0),
      StatCardCreator('likes', 0, 0),
      StatCardCreator('comments', 0, 0),
    ]);
  };

  const loadOtherData = async () => {
    try {
      await executeMultiple({
        performance: () => analyticsApi.getContentPerformance({dateRange}),
        sentiment: () => analyticsApi.getCommentSentiment({dateRange}),
        trend: () => analyticsApi.getFollowerTrend({dateRange}),
        postingTime: () => analyticsApi.getOptimalPostingTime()
      });

      console.log('📊 추가 데이터 결과:', results);
      console.log('❌ 추가 데이터 에러들:', errors);

      // 에러가 있는 경우에도 기본값 설정
      setContentPerformance(results.performance || []);
      setCommentSentiment(results.sentiment || []);
      setFollowerTrend(results.trend || {});
      setOptimalPostingTime(results.postingTime || {});

      // 개별 API 에러 로깅
      if (errors) {
        Object.entries(errors).forEach(([key, error]) => {
          console.error(`❌ ${key} API 에러:`, error);
        });
      }
    } catch (error) {
      console.error('❌ 추가 데이터 로드 실패:', error);
      // 에러 발생 시에도 기본값 설정
      setContentPerformance([]);
      setCommentSentiment([]);
      setFollowerTrend({});
      setOptimalPostingTime({});
    }
  };

  return {
    dateRange,
    setDateRange,
    overviewStats,
    contentPerformance,
    commentSentiment,
    followerTrend,
    optimalPostingTime,
    loading,
    error,
    errors // 개별 API 에러들도 노출
  };
};
