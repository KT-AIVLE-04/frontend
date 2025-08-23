import { Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/content';
import { ContentCard, DataListLayout } from '../../components';
import { useApi, useConfirm, useFileUpload, useNotification, useSearch } from '../../hooks';
import { Content } from '../../models';
import { SearchFilter } from './components';
import { VideoDetail } from './components/VideoDetail';

export function ContentManagement() {
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

  // 새로운 훅들 사용
  const { confirm } = useConfirm();
  const { success, error: showError } = useNotification();
  
  const contents = contentsData?.data ? 
    Content.fromResponseArray(contentsData.data.result || []) : [];

  // 검색 및 필터링
  const {
    searchTerm,
    filteredData: filteredContents,
    updateSearchTerm,
    updateFilter,
    clearAll: clearSearch
  } = useSearch(contents, ['title', 'contentType'], { debounceDelay: 300 });

  // 파일 업로드
  const {
    files,
    uploading: fileUploading,
    error: uploadError,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    formatFileSize
  } = useFileUpload({
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/*', 'image/*'],
    multiple: true
  });

  useEffect(() => {
    fetchContents({ query: searchTerm || undefined });
  }, [sortBy, searchTerm, fetchContents]);

  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    addFiles(fileList);
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) return;

    try {
      await uploadFiles(async (file) => {
        const response = await uploadContent(file);
        return response;
      });
      
      // 새 콘텐츠를 목록에 추가하기 위해 다시 fetch
      fetchContents({ query: searchTerm || undefined });
      success('파일이 성공적으로 업로드되었습니다.');
      clearFiles();
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      showError('파일 업로드에 실패했습니다.');
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
    const confirmed = await confirm({
      title: '콘텐츠 삭제',
      message: '정말로 이 콘텐츠를 삭제하시겠습니까?'
    });

    if (confirmed) {
      try {
        await deleteContent(contentId);
        setSelectedContent(null);
        // 목록 다시 fetch
        fetchContents({ query: searchTerm || undefined });
        success('콘텐츠가 삭제되었습니다.');
      } catch (error) {
        console.error('콘텐츠 삭제 실패:', error);
        showError('콘텐츠 삭제에 실패했습니다.');
      }
    }
  };

  const handleEditTitle = async (contentId, newTitle) => {
    try {
      const response = await updateContentTitle(contentId, newTitle);
      const updatedContent = Content.fromResponse(response.data.data);
      
      // 목록 다시 fetch
      fetchContents({ query: searchTerm || undefined });
      
      if (selectedContent && selectedContent.id === contentId) {
        setSelectedContent(updatedContent);
      }
      
      success('제목이 수정되었습니다.');
    } catch (error) {
      console.error('제목 수정 실패:', error);
      showError('제목 수정에 실패했습니다.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContents();
  };

  // 탭별 카운트 계산
  const videoCount = contents.filter(content => content.isVideo()).length;
  const imageCount = contents.filter(content => content.isImage()).length;
  const postCount = contents.length; // 전체 콘텐츠 수

  return (
    <>
    <DataListLayout
      loading={loading}
      error={error}
      topSection={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">콘텐츠 관리</h1>
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
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSearch={handleSearch}
            contentTypeFilter={contentTypeFilter}
            setContentTypeFilter={setContentTypeFilter}
          />
        </div>
      }
      data={filteredContents}
      isEmpty={filteredContents.length === 0}
      emptyTitle="콘텐츠가 없습니다"
      emptyMessage="생성된 콘텐츠가 여기에 표시됩니다."
      emptyAction={
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
          <Upload size={16} />
          파일 업로드하기
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      }
      renderList={() => (
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
    />

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
    </>
  );
}