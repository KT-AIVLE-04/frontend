import { Hash, MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { snsApi } from '../../api/sns';
import { ErrorPage } from '../../components/ErrorPage';
import { ConnectedAccounts, ScheduledPosts } from './components';

export function SnsIntegration() {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSnsData();
  }, []);

  const fetchSnsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountsResponse = await snsApi.getConnectedAccounts();
      setConnectedAccounts(accountsResponse.data?.result || []);
      
      const postsResponse = await snsApi.getScheduledPosts();
      setScheduledPosts(postsResponse.data?.result || []);
      
      const suggestionsResponse = await snsApi.getOptimizationSuggestions();
      setSuggestions(suggestionsResponse.data?.result || []);
      
    } catch (error) {
      console.error('SNS 데이터 로딩 실패:', error);
      setError('SNS 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (platform) => {
    try {
      await snsApi.connectAccount(platform, {});
      fetchSnsData();
    } catch (error) {
      console.error('계정 연결 실패:', error);
      alert('계정 연결에 실패했습니다.');
    }
  };

  const handleDisconnectAccount = async (platform) => {
    if (window.confirm('정말로 이 계정 연결을 해제하시겠습니까?')) {
      try {
        await snsApi.disconnectAccount(platform);
        fetchSnsData();
      } catch (error) {
        console.error('계정 연결 해제 실패:', error);
        alert('계정 연결 해제에 실패했습니다.');
      }
    }
  };

  const handleDeleteScheduledPost = async (postId) => {
    if (window.confirm('정말로 이 예약 게시물을 삭제하시겠습니까?')) {
      try {
        await snsApi.deleteScheduledPost(postId);
        fetchSnsData();
      } catch (error) {
        console.error('예약 게시물 삭제 실패:', error);
        alert('예약 게시물 삭제에 실패했습니다.');
      }
    }
  };

  if (error) {
    return <ErrorPage title="SNS 데이터 로딩 실패" message={error} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SNS 연동 및 관리</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ConnectedAccounts 
          connectedAccounts={connectedAccounts}
          onConnect={handleConnectAccount}
          onDisconnect={handleDisconnectAccount}
        />

        <div>
          <h2 className="text-lg font-semibold mb-4">SNS 최적화 제안</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className={`p-4 ${index < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center mb-2">
                  {suggestion.type === 'hashtag' && <Hash size={16} className="text-blue-600 mr-2" />}
                  {suggestion.type === 'timing' && <MessageSquare size={16} className="text-green-600 mr-2" />}
                  {suggestion.type === 'caption' && <MessageSquare size={16} className="text-purple-600 mr-2" />}
                  <h3 className="font-medium text-sm">{suggestion.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{suggestion.content}</p>
              </div>
            ))}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
              <button className="text-blue-600 text-sm font-medium">
                더 많은 제안 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <ScheduledPosts 
        scheduledPosts={scheduledPosts}
        onDelete={handleDeleteScheduledPost}
      />
    </div>
  );
} 