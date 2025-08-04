import { ArrowRight, CheckCircle, Clock, Sparkles, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/content';
import { storeApi } from '../../api/store';
import { ErrorPage } from '../../components/ErrorPage';
import { ContentTypeSelector } from './components';

export function ContentCreation() {
  const [activeStep, setActiveStep] = useState(1);
  const [contentType, setContentType] = useState(null);
  const [stores, setStores] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({
    storeId: '',
    additionalInfo: '',
    scenarioId: ''
  });
  const [loading, setLoading] = useState(false);
  const [contentStatus, setContentStatus] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contentType === 'video') {
      fetchStores();
      fetchScenarios();
    }
  }, [contentType]);

  useEffect(() => {
    if (contentId && activeStep === 3) {
      checkContentStatus();
    }
  }, [contentId, activeStep]);

  const fetchStores = async () => {
    try {
      setError(null);
      const response = await storeApi.getStores();
      setStores(response.data || []);
    } catch (error) {
      console.error('매장 목록 로딩 실패:', error);
      setError('매장 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchScenarios = async () => {
    try {
      setError(null);
      const response = await contentApi.getScenarios();
      setScenarios(response.data || []);
    } catch (error) {
      console.error('시나리오 목록 로딩 실패:', error);
      setError('시나리오 목록을 불러오는데 실패했습니다.');
    }
  };

  const checkContentStatus = async () => {
    if (!contentId) return;

    try {
      const response = await contentApi.getContentStatus(contentId);
      const status = response.data;
      setContentStatus(status);

      if (status.status === 'completed') {
        setTimeout(() => {
          setActiveStep(1);
          setContentType(null);
          setContentId(null);
          setContentStatus(null);
        }, 2000);
      } else if (status.status === 'failed') {
        alert('콘텐츠 생성에 실패했습니다.');
        setActiveStep(2);
      }
    } catch (error) {
      console.error('콘텐츠 상태 확인 실패:', error);
    }
  };

  const handleCreateContent = async () => {
    try {
      setLoading(true);
      const response = await contentApi.createContent({
        type: contentType,
        storeId: formData.storeId,
        additionalInfo: formData.additionalInfo,
        scenarioId: formData.scenarioId
      });
      
      setContentId(response.data.contentId);
      setActiveStep(3);
    } catch (error) {
      console.error('콘텐츠 생성 실패:', error);
      alert('콘텐츠 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return <ErrorPage title="데이터 로딩 실패" message={error} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">콘텐츠 제작</h1>
      
      {!contentType && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-xl font-semibold mb-8">
            제작할 콘텐츠 유형을 선택하세요
          </h2>
          <ContentTypeSelector contentType={contentType} setContentType={setContentType} />
        </div>
      )}

      {contentType === 'video' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">1</span>
                </div>
                <span className="ml-2 text-sm font-medium">정보 입력</span>
              </div>
              <div className={`w-12 h-0.5 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">2</span>
                </div>
                <span className="ml-2 text-sm font-medium">시나리오 선택</span>
              </div>
              <div className={`w-12 h-0.5 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">3</span>
                </div>
                <span className="ml-2 text-sm font-medium">콘텐츠 생성</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeStep === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  매장 정보 및 참고 자료 입력
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">매장 정보</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                          매장 선택
                        </label>
                        <select 
                          id="storeName" 
                          name="storeId"
                          value={formData.storeId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">매장을 선택하세요</option>
                          {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                          추가 정보 입력
                        </label>
                        <textarea 
                          id="additionalInfo" 
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleInputChange}
                          rows={3} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="숏폼에 포함되었으면 하는 내용을 입력하세요"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-3">
                      참고 자료 업로드
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload size={32} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 mb-2">
                        참고할 이미지나 영상을 업로드하세요
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        JPG, PNG, MP4, MOV 파일 지원 (최대 50MB)
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        파일 선택
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setActiveStep(2)}
                    disabled={!formData.storeId}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음 단계
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">시나리오 선택</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">시나리오 {scenario.id}</h3>
                        {scenario.isRecommended && (
                          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            추천
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {scenario.description}
                      </p>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => {
                            setFormData(prev => ({ ...prev, scenarioId: scenario.id }));
                            setActiveStep(3);
                          }}
                          className="text-sm text-blue-600 font-medium"
                        >
                          이 시나리오로 제작하기
                        </button>
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
                    onClick={handleCreateContent}
                    disabled={loading || !formData.scenarioId}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '생성 중...' : '이 시나리오로 제작하기'}
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
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
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <button 
                    onClick={() => {
                      setActiveStep(1);
                      setContentType(null);
                    }}
                    className="px-6 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {contentType === 'image' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
          <h2 className="text-lg font-semibold mb-4">이미지 생성</h2>
          <p className="text-gray-500 mb-6">
            AI 이미지 생성 기능은 준비 중입니다. 곧 서비스될 예정입니다.
          </p>
          <button 
            onClick={() => setContentType(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            돌아가기
          </button>
        </div>
      )}
    </div>
  );
} 