import { Upload, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/content';
import { ContentCard, EmptyStateBox, ErrorPage, LoadingSpinner } from '../../components';
import { useApi } from '../../hooks';
import { Content } from '../../models';
import { SearchFilter } from './components';
import { VideoDetail } from './components/VideoDetail';

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentTypeFilter, setContentTypeFilter] = useState({
    videos: true,
    images: true
  });

  // useApi 훅 사용
  const { data: contentsData, loading, error, execute: fetchContents } = useApi(contentApi.getContents);
  const { loading: uploading, execute: uploadContent } = useApi(contentApi.uploadContent);
  const { execute: deleteContent } = useApi(contentApi.deleteContent);
  const { execute: updateContentTitle } = useApi(contentApi.updateContentTitle);

  useEffect(() => {
    fetchContents({ query: searchTerm || undefined });
  }, [sortBy, searchTerm, fetchContents]);

  const contents = contentsData?.data ? 
    Content.fromResponseArray(contentsData.data.result || []) : [];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await uploadContent(file);
      const newContent = Content.fromResponse(response.data.data);
      
      // 새 콘텐츠를 목록에 추가하기 위해 다시 fetch
      fetchContents({ query: searchTerm || undefined });
      alert('파일이 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      event.target.value = ''; // 파일 input 초기화
    }
  };

  const handleCardClick = (content) => {
    console.log('카드 클릭됨:', content);
    setSelectedContent(content);
  };

  const handleCloseDetail = () => {
    setSelectedContent(null);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      try {
        await deleteContent(contentId);
        setSelectedContent(null);
        // 목록 다시 fetch
        fetchContents({ query: searchTerm || undefined });
        alert('콘텐츠가 삭제되었습니다.');
      } catch (error) {
        console.error('콘텐츠 삭제 실패:', error);
        alert('콘텐츠 삭제에 실패했습니다.');
      }
    }
  };

  const handleEditTitle = async (contentId, newTitle) => {
    try {
      const response = await updateContentTitle(contentId, newTitle);
      const updatedContent = Content.fromResponse(response.data.data);
      
      // 목록 다시 fetch
      fetchContents({ query: searchTerm || undefined });
      ));
      
      if (selectedContent && selectedContent.id === contentId) {
        setSelectedContent(updatedContent);
      }
      
      alert('제목이 수정되었습니다.');
    } catch (error) {
      console.error('제목 수정 실패:', error);
      alert('제목 수정에 실패했습니다.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContents();
  };

  const filteredContents = contents.filter(content => {
    const isVideo = content.isVideo();
    const isImage = content.isImage();
    
    if (isVideo && contentTypeFilter.videos) return true;
    if (isImage && contentTypeFilter.images) return true;
    
    return false;
  });

  // 탭별 카운트 계산
  const videoCount = contents.filter(content => content.isVideo()).length;
  const imageCount = contents.filter(content => content.isImage()).length;
  const postCount = contents.length; // 전체 콘텐츠 수

  if (error) {
    return <ErrorPage title="콘텐츠 목록 로딩 실패" message={error}/>;
  }

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">콘텐츠 관리</h1>
        
        {/* 파일 업로드 버튼 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            {uploading ? '업로드 중...' : '파일 업로드'}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearch={handleSearch}
        contentTypeFilter={contentTypeFilter}
        setContentTypeFilter={setContentTypeFilter}
      />

      {filteredContents.length === 0 ? (
        <EmptyStateBox
          icon={Video}
          title="콘텐츠가 없습니다"
          description="생성된 콘텐츠가 여기에 표시됩니다."
          actionText="파일 업로드하기"
          onAction={() => document.querySelector('input[type="file"]').click()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContents.map((content) => (
            <ContentCard
              key={content.id}
              content={{
                id: content.id,
                url: content.url,
                title: content.title,
                contentType: content.contentType,
                createdAt: content.createdAt,
                updatedAt: content.updatedAt,
                objectKey: content.objectKey
              }}
              onClick={() => handleCardClick(content)}
              onDownload={() => window.open(content.url, '_blank')}
              onEdit={() => {
                const newTitle = prompt('새 제목을 입력하세요:', content.title);
                if (newTitle && newTitle !== content.title) {
                  handleEditTitle(content.id, newTitle);
                }
              }}
              onDelete={() => handleDelete(content.id)}
            />
          ))}
        </div>
      )}

      {/* 상세보기 컴포넌트 */}
      {selectedContent && (
        <VideoDetail
          video={{
            ...selectedContent,
            type: selectedContent.isVideo() ? 'video' : 'image',
            thumbnailUrl: selectedContent.url,
            author: '나',
            views: 0,
            createdAt: selectedContent.getFormattedCreatedAt(),
            description: `${selectedContent.getFormattedSize()} • ${selectedContent.getResolution()}`,
            likes: 0,
            comments: 0
          }}
          onClose={handleCloseDetail}
          handleDownload={() => window.open(selectedContent.url, '_blank')}
          handleEdit={() => {
            const newTitle = prompt('새 제목을 입력하세요:', selectedContent.title);
            if (newTitle && newTitle !== selectedContent.title) {
              handleEditTitle(selectedContent.id, newTitle);
            }
          }}
          handleDelete={() => handleDelete(selectedContent.id)}
        />
      )}
    </div>
  );
}