import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useShortformGeneration } from '../../context/ShortformGenerationContext';
import { shortApi } from '../../../../api/short';
import { VideoPreview } from './VideoPreview';

export const ShortsGeneration = ({ setContentType }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    contentId,
    contentStatus,
    setContentStatus,
    videoUrl,
    videoKey,
    setActiveStep,
    resetToInputStep
  } = useShortformGeneration();

  // useEffect(() => {
  //   if (contentId) {
  //     checkContentStatus();
  //   }
  // }, [contentId]);

  // videoUrl 또는 videoKey가 설정되면 자동으로 VideoPreview 표시
  useEffect(() => {
    if (videoUrl) {
      console.log('Video URL 설정됨:', { videoUrl });
    }
  }, [videoUrl]);

  // const checkContentStatus = async () => {
  //   if (!contentId) return;

  //   try {
  //     const response = await contentApi.getContentStatus(contentId);
  //     const status = response.data;
  //     setContentStatus(status);

  //     if (status.status === 'completed') {
  //       // 영상 생성 완료 시 더 이상 자동으로 초기화하지 않음
  //     } else if (status.status === 'failed') {
  //       alert('콘텐츠 생성에 실패했습니다.');
  //       setActiveStep(2);
  //     }
  //   } catch (error) {
  //     console.error('콘텐츠 상태 확인 실패:', error);
  //   }
  // };

  const handleRegenerate = () => {
    const userConfirmed = window.confirm(
      '정보 입력 단계로 돌아가시겠습니까?\n\n매장 정보와 광고 정보를 수정하고 시나리오를 다시 생성할 수 있습니다.'
    );
    
    if (userConfirmed) {
      resetToInputStep();
    }
  };

  const handleSave = async () => {
    if (!videoKey) {
      alert('저장할 비디오가 없습니다.');
      return;
    }

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      console.log('숏폼 저장 시작:', videoKey);
      const response = await shortApi.saveShorts(videoKey);
      console.log('숏폼 저장 성공:', response.data);
      alert('숏폼이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('숏폼 저장 실패:', error);
      alert('숏폼 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  
  if (videoUrl) {
  // context에 videoUrl이 있거나 contentStatus가 완료 상태인 경우 VideoPreview 렌더링
  // if (videoUrl || (contentStatus && contentStatus.status === 'completed')) {
    const displayVideoUrl = videoUrl;
    return (
      <VideoPreview
        videoUrl={displayVideoUrl}
        onRegenerate={handleRegenerate}
        onSave={handleSave}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">콘텐츠 생성</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Sparkles size={48} className="text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          AI가 숏폼을 생성하고 있습니다
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          선택한 시나리오를 바탕으로 고품질 숏폼을 제작 중입니다.
          잠시만 기다려주세요.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 max-w-md mx-auto">
          <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
        </div>
        <p className="text-xs text-gray-500 mb-8">약 2분 남음</p>
        <div className="flex flex-col items-center space-y-2 max-w-xs mx-auto">
          <div className="flex items-center w-full">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <span className="text-sm">시나리오 분석 완료</span>
          </div>
          <div className="flex items-center w-full">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <span className="text-sm">영상 소재 준비 완료</span>
          </div>
          <div className="flex items-center w-full">
            <Clock size={16} className="text-blue-500 mr-2" />
            <span className="text-sm">영상 렌더링 중...</span>
          </div>
          <div className="flex items-center w-full text-gray-400">
            <Clock size={16} className="mr-2" />
            <span className="text-sm">최종 처리 대기 중</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        {/* <button 
          onClick={() => setActiveStep(2)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          이전
        </button>
        <button 
          onClick={() => {
            resetForm();
            setContentType(null);
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700"
        >
          취소
        </button> */}
      </div>
    </div>
  );
};