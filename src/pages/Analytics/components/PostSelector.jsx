import React from 'react';
import { Select } from '../../../components/atoms';

export function PostSelector({
  selectedSnsType,
  setSelectedSnsType,
  selectedPostId,
  setSelectedPostId,
  posts,
  contents
}) {
  const snsTypes = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' }
  ];

  // 모든 게시물과 콘텐츠를 합쳐서 표시
  const allItems = [
    ...posts.map(post => ({
      id: post.id || post.postId,
      title: post.title || `포스트 ${post.id || post.postId}`,
      type: 'post',
      platform: post.snsType || selectedSnsType,
      createdAt: post.createdAt
    })),
    ...contents.map(content => ({
      id: content.id || content.contentId,
      title: content.title || `콘텐츠 ${content.id || content.contentId}`,
      type: 'content',
      platform: 'youtube', // 기본값
      createdAt: content.createdAt
    }))
  ];

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
          <Select
            value={selectedSnsType}
            onChange={handleSnsTypeChange}
            options={snsTypes}
            placeholder="SNS 타입을 선택하세요"
          />
        </div>

        {/* 게시물/콘텐츠 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            게시물/콘텐츠
          </label>
          <Select
            value={selectedPostId}
            onChange={handlePostChange}
            options={allItems.map(item => ({
              value: item.id,
              label: `${item.title} (${item.type === 'post' ? '포스트' : '콘텐츠'})`
            }))}
            placeholder="게시물을 선택하세요"
          />
        </div>
      </div>

      {/* 선택된 항목 정보 */}
      {selectedPostId && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <span className="font-medium">선택된 항목:</span>{' '}
            {allItems.find(item => item.id === selectedPostId)?.title}
          </div>
        </div>
      )}
    </div>
  );
}
