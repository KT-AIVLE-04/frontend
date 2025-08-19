import {ArrowRight, CheckCircle} from 'lucide-react';
import React from 'react';
import {useShortformGeneration} from '../../context/ShortformGenerationContext';
import {shortApi} from "../../../../api/short.js";

export const ScenarioSelection = () => {
  const {
    scenarios,
    selectedScenarioId,
    setSelectedScenarioId,
    formData,
    setFormData,
    loading,
    setLoading,
    setActiveStep,
    setVideoUrl,
    setVideoKey,
    sessionId
  } = useShortformGeneration();

  const handleCreateShorts = async () => {
    try {
      setLoading(true);

      const selectedScenario = scenarios.find(scenario => scenario.id === selectedScenarioId);

      const durationNumber = parseInt(formData.adInfo.adDuration.replace('초', ''));

      const requestData = {
        sessionId: sessionId,
        title: selectedScenario?.title || '',
        content: selectedScenario?.description || '',
        adDuration: durationNumber
      };

      const images = formData.storeInfo.referenceFiles.map(file => file.file);

      console.log('숏폼 생성 요청 데이터:', requestData);
      setActiveStep(3);

      // 테스트용 - 2초 후 mock response 설정
      // setTimeout(() => {
      //   const mockResponse = {
      //     data: {
      //       contentId: 'test-content-id',
      //       videoUrl: 'https://replicate.delivery/xezq/b6ALBNKtyR7rBVPf7fRpfm1SUbcNiSl9t15Uv9I5eJDmsbwUB/tmphu60dpzx.mp4',
      //       key: 'key'
      //     }
      //   };

      //   console.log('숏폼 생성 응답 (테스트):', mockResponse.data);

      //   // videoUrl과 key가 있으면 저장
      //   if (mockResponse.data.videoUrl) {
      //     setVideoUrl(mockResponse.data.videoUrl);
      //   }
      //   if (mockResponse.data.key) {
      //     setVideoKey(mockResponse.data.key);
      //   }
      // }, 2000);

      const response = await shortApi.createShorts(requestData, images);
      console.log('숏폼 생성 응답:', response.data);

      // videoUrl과 key가 있으면 저장
      if (response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      }
      if (response.data.key) {
        setVideoKey(response.data.key);
      }
    } catch (error) {
      console.error('숏폼 생성 실패:', error);
      alert('숏폼 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">시나리오 선택</h2>
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => setSelectedScenarioId(scenario.id)}
            className={`border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer ${
              selectedScenarioId === scenario.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-600 font-semibold">시나리오{scenario.id}</div>
                {selectedScenarioId === scenario.id && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-white"/>
                  </div>
                )}
              </div>
              {scenario.isRecommended && (
                <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                  추천
                </div>
              )}
            </div>
            <hr className="border-gray-200 mb-4"/>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{scenario.title}</h3>
            </div>
            <div className="mb-2">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {scenario.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setActiveStep(1)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          이전
        </button>
        <button
          onClick={() => {
            if (selectedScenarioId) {
              setFormData(prev => ({...prev, scenarioId: selectedScenarioId}));
              handleCreateShorts();
            }
          }}
          disabled={loading || !selectedScenarioId}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '생성 중...' : '이 시나리오로 제작하기'}
          <ArrowRight size={16} className="ml-2"/>
        </button>
      </div>
    </div>
  );
};