import { Calendar, CheckCircle, Facebook, Hash, Instagram, MessageSquare, Plus, XCircle, Youtube } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { snsApi } from '../api/sns';
import { ErrorPage } from '../components/ErrorPage';

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
      
      // 연동된 계정 목록
      const accountsResponse = await snsApi.getConnectedAccounts();
      setConnectedAccounts(accountsResponse.data?.result || []);
      
      // 예약 게시물 목록
      const postsResponse = await snsApi.getScheduledPosts();
      setScheduledPosts(postsResponse.data?.result || []);
      
      // 최적화 제안
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
      // 실제로는 OAuth 인증 플로우를 거쳐야 함
      await snsApi.connectAccount(platform, {});
      fetchSnsData(); // 데이터 새로고침
    } catch (error) {
      console.error('계정 연결 실패:', error);
      alert('계정 연결에 실패했습니다.');
    }
  };

  const handleDisconnectAccount = async (platform) => {
    if (window.confirm('정말로 이 계정 연결을 해제하시겠습니까?')) {
      try {
        await snsApi.disconnectAccount(platform);
        fetchSnsData(); // 데이터 새로고침
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
        fetchSnsData(); // 데이터 새로고침
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
        {/* 계정 연동 상태 */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">연동된 SNS 계정</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {connectedAccounts.map((account, index) => (
              <div key={index} className={`p-4 flex items-center justify-between ${index < connectedAccounts.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.type === 'instagram' ? 'bg-pink-100' : 
                    account.type === 'facebook' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {account.type === 'instagram' && <Instagram size={20} className="text-pink-600" />}
                    {account.type === 'facebook' && <Facebook size={20} className="text-blue-600" />}
                    {account.type === 'youtube' && <Youtube size={20} className="text-red-600" />}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="font-medium">{account.name}</p>
                      {account.connected ? (
                        <span className="ml-2 flex items-center text-xs text-green-600">
                          <CheckCircle size={12} className="mr-1" />
                          연결됨
                        </span>
                      ) : (
                        <span className="ml-2 flex items-center text-xs text-red-600">
                          <XCircle size={12} className="mr-1" />
                          연결 안됨
                        </span>
                      )}
                    </div>
                    {account.connected && (
                      <p className="text-xs text-gray-500">
                        팔로워 {account.followers} · 게시물 {account.posts}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => account.connected ? handleDisconnectAccount(account.type) : handleConnectAccount(account.type)}
                  className={`px-3 py-1 rounded text-sm ${
                    account.connected 
                      ? 'border border-gray-300 text-gray-600 hover:bg-gray-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {account.connected ? '연결해제' : '연결하기'}
                </button>
              </div>
            ))}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button className="flex items-center text-blue-600 text-sm font-medium">
                <Plus size={16} className="mr-1" />
                새 SNS 계정 연결하기
              </button>
            </div>
          </div>
        </div>

        {/* 최적화 제안 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">SNS 최적화 제안</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className={`p-4 ${index < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center mb-2">
                  {suggestion.type === 'hashtag' && <Hash size={16} className="text-blue-600 mr-2" />}
                  {suggestion.type === 'timing' && <Calendar size={16} className="text-green-600 mr-2" />}
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

      {/* 예약 게시물 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">예약된 게시물</h2>
          <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            <Plus size={16} className="mr-1" />
            새 예약 게시
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    콘텐츠
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    플랫폼
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduledPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={post.thumbnail} 
                          alt={post.title} 
                          className="h-10 w-10 rounded object-cover" 
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {post.platform === 'instagram' && <Instagram size={16} className="text-pink-600 mr-2" />}
                        {post.platform === 'facebook' && <Facebook size={16} className="text-blue-600 mr-2" />}
                        {post.platform === 'youtube' && <Youtube size={16} className="text-red-600 mr-2" />}
                        <span className="text-sm text-gray-500 capitalize">
                          {post.platform}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.scheduledDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'scheduled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'scheduled' ? '예약됨' : '임시저장'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        편집
                      </button>
                      <button 
                        onClick={() => handleDeleteScheduledPost(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        취소
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 