import {useEffect, useState} from 'react';
import {analyticsApi} from '../../../api/analytics';
import {contentApi} from '../../../api/content';
import {snsApi} from '../../../api/sns';
import {createStatCard} from '../components';

// 테스트용 임시 데이터
const TEST_ACCOUNT_IDS = [1];
const TEST_POST_IDS = [1];

export const useAnalyticsData = () => {
  const [dateRange, setDateRange] = useState('last7');
  const [overviewStats, setOverviewStats] = useState([]);
  const [contentPerformance, setContentPerformance] = useState([]);
  const [commentSentiment, setCommentSentiment] = useState([]);
  const [followerTrend, setFollowerTrend] = useState({});
  const [optimalPostingTime, setOptimalPostingTime] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      fetchAnalyticsData();
    }
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 fetchAnalyticsData 시작');

      const yesterdayStr = getYesterdayString();
      console.log('📅 어제 날짜:', yesterdayStr);

      const {accountIds, postIds} = await getUserData();
      console.log('👥 계정 ID들:', accountIds);
      console.log('📝 게시물 ID들:', postIds);

      if (accountIds.length === 0 && postIds.length === 0) {
        console.log('⚠️ 계정이나 게시물이 없어서 기본값 사용');
        setDefaultStats();
        await loadOtherData();
        return;
      }

      console.log('🚀 메트릭 데이터 가져오기 시작');
      const {realtimeData, yesterdayData} = await fetchMetricsData(accountIds, postIds, yesterdayStr);
      console.log('📊 실시간 데이터:', realtimeData);
      console.log('📊 어제 데이터:', yesterdayData);

      const stats = createOverviewStats(realtimeData, yesterdayData);
      console.log('📈 생성된 통계:', stats);

      setOverviewStats(stats);
      await loadOtherData();

    } catch (error) {
      console.error('❌ 분석 데이터 로딩 실패:', error);
      setError('분석 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const getUserData = async () => {
    try {
      console.log('🔍 사용자 데이터 가져오기 시작');

      const [accountsResponse, postsResponse] = await Promise.all([
        snsApi.getConnectedAccounts(),
        contentApi.getContents()
      ]);

      console.log('📱 SNS 계정 응답:', accountsResponse);
      console.log('📄 콘텐츠 응답:', postsResponse);

      const accounts = accountsResponse.data?.result || [];
      const posts = postsResponse.data?.result || [];

      console.log('👥 원본 계정 데이터:', accounts);
      console.log('📝 원본 게시물 데이터:', posts);

      const accountIds = accounts.map(account =>
        account.id || account.accountId || account.snsAccountId
      ).filter(Boolean);

      const postIds = posts.map(post =>
        post.id || post.postId || post.contentId
      ).filter(Boolean);

      // 테스트용 임시 데이터 (실제 데이터가 없을 때)
      if (accountIds.length === 0 && postIds.length === 0) {
        console.log('🧪 테스트용 임시 데이터 사용');
        return {
          accountIds: TEST_ACCOUNT_IDS,
          postIds: TEST_POST_IDS
        };
      }

      console.log('🆔 추출된 계정 ID들:', accountIds);
      console.log('🆔 추출된 게시물 ID들:', postIds);

      return {accountIds, postIds};
    } catch (error) {
      console.warn('❌ 사용자 데이터 가져오기 실패:', error);
      // 에러 시에도 테스트용 데이터 사용
      console.log('🧪 에러 시 테스트용 임시 데이터 사용');
      return {
        accountIds: TEST_ACCOUNT_IDS,
        postIds: TEST_POST_IDS
      };
    }
  };

  const fetchMetricsData = async (accountIds, postIds, yesterdayStr) => {
    console.log('fetchMetricsData', accountIds, postIds, yesterdayStr);
    const realtimePromises = [
      ...accountIds.map(id => analyticsApi.getRealtimeAccountMetrics(id).catch(handleApiError)),
      ...postIds.map(id => analyticsApi.getRealtimePostMetrics(id).catch(handleApiError))
    ];

    const historyPromises = [
      ...accountIds.map(id => analyticsApi.getHistoryAccountMetrics(id, yesterdayStr).catch(handleApiError)),
      ...postIds.map(id => analyticsApi.getHistoryPostMetrics(id, yesterdayStr).catch(handleApiError))
    ];

    const [realtimeResponses, historyResponses] = await Promise.all([
      Promise.all(realtimePromises),
      Promise.all(historyPromises)
    ]);

    const realtimeData = aggregateMetrics(realtimeResponses);
    const yesterdayData = aggregateMetrics(historyResponses);

    return {realtimeData, yesterdayData};
  };

  const handleApiError = (error) => {
    console.warn('API 호출 실패:', error);
    return {data: {result: null}};
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

    // result가 배열인 경우 마지막 항목만 사용
    if (Array.isArray(result)) {
      const lastItem = result[0];
      return {
        views: parseInt(lastItem.views) || 0,
        likes: parseInt(lastItem.likes) || 0,
        comments: parseInt(lastItem.comments) || 0
      };
    } else {
      // result가 단일 객체인 경우
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

  const loadOtherData = async () => {
    try {
      const [performanceResponse, sentimentResponse, trendResponse, postingTimeResponse] = await Promise.all([
        analyticsApi.getContentPerformance({dateRange}).catch(() => ({data: {result: []}})),
        analyticsApi.getCommentSentiment({dateRange}).catch(() => ({data: {result: []}})),
        analyticsApi.getFollowerTrend({dateRange}).catch(() => ({data: {result: {}}})),
        analyticsApi.getOptimalPostingTime().catch(() => ({data: {result: {}}}))
      ]);

      setContentPerformance(performanceResponse.data?.result || []);
      setCommentSentiment(sentimentResponse.data?.result || []);
      setFollowerTrend(trendResponse.data?.result || {});
      setOptimalPostingTime(postingTimeResponse.data?.result || {});
    } catch (error) {
      console.warn('추가 데이터 로드 실패:', error);
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
    error
  };
};
