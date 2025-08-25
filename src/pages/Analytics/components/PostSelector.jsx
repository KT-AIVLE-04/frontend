import React from 'react';

export function PostSelector({
  selectedSnsType,
  setSelectedSnsType,
  selectedPostId,
  setSelectedPostId,
  posts,
  connectionStatus
}) {
  const snsTypes = [
    { 
      value: 'youtube', 
      label: 'YouTube',
      status: connectionStatus?.youtube?.status || 'disconnected'
    },
    { 
      value: 'instagram', 
      label: 'Instagram',
      status: connectionStatus?.instagram?.status || 'disconnected'
    },
    { 
      value: 'facebook', 
      label: 'Facebook',
      status: connectionStatus?.facebook?.status || 'disconnected'
    }
  ];

  // 게시물만 표시 (콘텐츠는 아직 SNS에 올라가지 않은 것들이므로 제외)
  const allItems = posts.map(post => ({
    id: post.id || post.postId,
    title: post.title || `포스트 ${post.id || post.postId}`,
    type: 'post',
    platform: post.snsType || selectedSnsType,
    createdAt: post.createdAt
  }));

  const handleSnsTypeChange = (value) => {
    setSelectedSnsType(value);
    // SNS 타입이 변경되면 해당 타입의 첫 번째 게시물을 선택
    const firstPostOfType = allItems.find(item => item.platform === value);
    if (firstPostOfType) {
      setSelectedPostId(firstPostOfType.id);
    }
  };

  const handlePostChange = (value) => {
    setSelectedPostId(value);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">분석 대상 선택</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SNS 타입 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SNS 플랫폼
          </label>
          <div className="space-y-2">
            {snsTypes.map((snsType) => (
              <div
                key={snsType.value}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSnsType === snsType.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSnsTypeChange(snsType.value)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">
                    {snsType.value === 'youtube' ? '🎥' : snsType.value === 'instagram' ? '📷' : '📘'}
                  </span>
                  <span className="font-medium text-gray-900">{snsType.label}</span>
                </div>
                <div className="flex items-center">
                  {snsType.status === 'connected' && (
                    <span className="text-green-600 text-sm font-medium">연결됨</span>
                  )}
                  {snsType.status === 'disconnected' && (
                    <span className="text-gray-400 text-sm">연결 안됨</span>
                  )}
                  {snsType.status === 'error' && (
                    <span className="text-red-600 text-sm">오류</span>
                  )}
                  {selectedSnsType === snsType.value && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 게시물/콘텐츠 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            게시물/콘텐츠
          </label>
          {allItems.length === 0 ? (
            <div className="p-4 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-400 text-2xl mb-2">📝</div>
              <p className="text-gray-500 text-sm">게시물이 없습니다</p>
              <p className="text-gray-400 text-xs mt-1">게시물을 업로드하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPostId === item.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePostChange(item.id)}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-lg mr-3">
                      {item.type === 'post' ? '📝' : '🎬'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.type === 'post' ? '포스트' : '콘텐츠'} • {item.platform}
                      </div>
                    </div>
                  </div>
                  {selectedPostId === item.id && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 선택된 항목 정보 */}
      {selectedPostId && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-600 text-lg mr-3">
                {allItems.find(item => item.id === selectedPostId)?.type === 'post' ? '📝' : '🎬'}
              </span>
              <div>
                <div className="text-sm font-medium text-blue-900">
                  선택된 항목
                </div>
                <div className="text-sm text-blue-700">
                  {allItems.find(item => item.id === selectedPostId)?.title}
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
              분석 준비 완료
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
