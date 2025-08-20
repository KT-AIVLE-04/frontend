import {ArrowRight, Upload, X, Trash2, Loader2} from 'lucide-react';
import React, { useState } from 'react';
import {useShortformGeneration} from '../../context/ShortformGenerationContext';
import {shortApi} from "../../../../api/short.js";

export const InformationInput = () => {
  const [validationErrors, setValidationErrors] = useState({});
  
  const {
    formData,
    loading,
    setLoading,
    error,
    setError,
    brandConceptInput,
    setBrandConceptInput,
    setFileInputRef,
    setActiveStep,
    setScenarios,
    setSessionId,
    selectedStoreId,
    handleInputChange,
    handleAddBrandConcept,
    handleRemoveBrandConcept,
    formatFileSize,
    handleFileSelect,
    handleRemoveFile,
    handleFileButtonClick
  } = useShortformGeneration();

  const generateScenarios = async () => {
    try {
      setError(null);
      setLoading(true);

      const scenarioData = {
        prompt: formData.adInfo.additionalInfo || '',
        platform: formData.adInfo.adPlatform,
        target: formData.adInfo.adTarget,
        adType: formData.adInfo.adType,
        brandConcepts: formData.storeInfo.brandConcepts
      };

      const response = await shortApi.createScenarios(scenarioData);
      console.log('시나리오 생성 응답:', response.data);

      if (response.data?.isSuccess && response.data?.result?.scenarios) {
        if (response.data.result.sessionId) {
          setSessionId(response.data.result.sessionId);
          console.log('SessionId 저장:', response.data.result.sessionId);
        }

        const formattedScenarios = response.data.result.scenarios.map((scenario, index) => ({
          id: index + 1,
          title: scenario.title,
          description: scenario.content,
          isRecommended: index === 0
        }));
        setScenarios(formattedScenarios);
      } else {
        setScenarios([]);
        setError('시나리오 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('시나리오 생성 실패:', error);
      setError('시나리오 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // 브랜드 컨셉 검증
    if (formData.storeInfo.brandConcepts.length === 0) {
      errors.brandConcepts = true;
    }
    
    // 이미지 업로드 검증
    if (formData.storeInfo.referenceFiles.length === 0) {
      errors.referenceFiles = true;
    }
    
    // 광고 타입 검증
    if (!formData.adInfo.adType) {
      errors.adType = true;
    }
    
    // 광고 플랫폼 검증
    if (!formData.adInfo.adPlatform) {
      errors.adPlatform = true;
    }
    
    // 광고 타겟 검증
    if (!formData.adInfo.adTarget?.trim()) {
      errors.adTarget = true;
    }
    
    // 광고 시간 검증
    if (!formData.adInfo.adDuration) {
      errors.adDuration = true;
    }
    
    // 광고 요구사항 검증
    if (!formData.adInfo.additionalInfo?.trim()) {
      errors.additionalInfo = true;
    }
    
    setValidationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const focusFirstErrorField = (errors) => {
    // 우선순위 순서대로 포커스 (위쪽, 왼쪽 우선)
    const errorFieldMap = [
      { field: 'brandConcepts', elementId: 'brandConcept' },
      { field: 'adType', elementId: 'adType' },
      { field: 'adPlatform', elementId: 'adPlatform' },
      { field: 'adTarget', elementId: 'adTarget' },
      { field: 'adDuration', elementId: 'adDuration' },
      { field: 'additionalInfo', elementId: 'adAdditionalInfo' }
    ];
    
    for (const { field, elementId } of errorFieldMap) {
      if (errors[field]) {
        const element = document.getElementById(elementId);
        if (element) {
          setTimeout(() => {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100); // DOM 업데이트 후 포커스
          break;
        }
      }
    }
  };

  const clearValidationError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }
  };

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.split('.')[1];
    clearValidationError(fieldName);
    handleInputChange(e);
  };

  const handleBrandConceptInputChange = (e) => {
    setBrandConceptInput(e.target.value);
    // 브랜드 컨셉이 입력되면 validation error 제거
    if (e.target.value.trim() || formData.storeInfo.brandConcepts.length > 0) {
      clearValidationError('brandConcepts');
    }
  };

  const handleLocalAddBrandConcept = (e) => {
    handleAddBrandConcept(e);
    // 브랜드 컨셉이 추가되면 validation error 제거
    clearValidationError('brandConcepts');
  };

  const handleLocalFileSelect = async (e) => {
    await handleFileSelect(e);
    // 파일이 선택되면 validation error 제거
    clearValidationError('referenceFiles');
  };

  return (
    <div className="relative">
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4"/>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">시나리오 생성 중</h3>
            <p className="text-sm text-gray-500 text-center">
              입력하신 정보를 바탕으로<br/>
              AI가 맞춤형 시나리오를 생성하고 있습니다.
            </p>
            <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className={loading ? 'blur-sm pointer-events-none' : ''}>
        {/* 매장 정보 섹션 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            📍 매장 정보 입력
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 매장 기본 정보 */}
            <div className="space-y-4">
              {/* 매장 이름 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매장 이름
                </label>
                <input
                  type="text"
                  value={formData.storeInfo.storeName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  placeholder="매장 정보를 불러오는 중..."
                />
              </div>

              {/* 업종 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  업종
                </label>
                <input
                  type="text"
                  value={formData.storeInfo.businessType}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  placeholder="업종 정보를 불러오는 중..."
                />
              </div>

              {/* 브랜드 컨셉 (태그 형태) */}
              <div>
                <label htmlFor="brandConcept" className="block text-sm font-medium text-gray-700 mb-1">
                  브랜드 컨셉 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* 입력 필드 */}
                  <input
                    id="brandConcept"
                    type="text"
                    value={brandConceptInput}
                    onChange={handleBrandConceptInputChange}
                    onKeyDown={handleLocalAddBrandConcept}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.brandConcepts ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="브랜드 컨셉을 입력하고 엔터를 누르세요 (예: 트렌디한, 친환경적인, 고급스러운)"
                  />

                  {/* 브랜드 컨셉 태그들 */}
                  {formData.storeInfo.brandConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.storeInfo.brandConcepts.map((concept, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          <span>{concept}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBrandConcept(concept)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            <X size={14}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽: 이미지 업로드 */}
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                이미지 업로드 <span className="text-red-500">*</span> ({formData.storeInfo.referenceFiles.length}/5)
              </h4>

              {/* 파일이 없는 경우 업로드 영역 */}
              {formData.storeInfo.referenceFiles.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center flex-1 flex flex-col justify-center min-h-[240px] ${
                    validationErrors.referenceFiles ? 'border-red-500' : 'border-gray-300'
                  }`}>
                  <Upload size={32} className="text-gray-400 mx-auto mb-3"/>
                  <p className="text-sm text-gray-500 mb-2">
                    매장 이미지나 제품 사진을 업로드하세요
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    JPG, JPEG, PNG 파일 지원 (최대 50MB, 최대 5개)
                  </p>
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    파일 선택
                  </button>
                  <input
                    type="file"
                    ref={setFileInputRef}
                    onChange={handleLocalFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              ) : (
                /* 파일이 있는 경우 카드 뷰 */
                <div className="flex-1 min-h-[240px]">
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {formData.storeInfo.referenceFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                      >
                        {/* 이미지 미리보기 */}
                        <div className="aspect-square relative w-full h-40">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover object-center"
                          />
                          {/* 호버 시 삭제 오버레이 */}
                          <div
                            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="p-1.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                            >
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </div>
                        {/* 파일 정보 */}
                        <div className="p-1.5">
                          <p className="text-xs text-gray-700 font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 추가 업로드 버튼 (5개 미만일 때만) */}
                  {formData.storeInfo.referenceFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={handleFileButtonClick}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + 파일 추가 ({5 - formData.storeInfo.referenceFiles.length}개 더 추가 가능)
                    </button>
                  )}

                  <input
                    type="file"
                    ref={setFileInputRef}
                    onChange={handleLocalFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 광고 정보 섹션 */}
        <div className="mt-12 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            📍 광고 정보 입력
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 광고 타입, 플랫폼, 타겟 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="adType" className="block text-sm font-medium text-gray-700 mb-1">
                  광고 타입 <span className="text-red-500">*</span>
                </label>
                <select
                  id="adType"
                  name="adInfo.adType"
                  value={formData.adInfo.adType}
                  onChange={handleLocalInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.adType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">광고 타입을 선택하세요</option>
                  <option value="제품 홍보">제품 홍보</option>
                  <option value="브랜드 홍보">브랜드 홍보</option>
                  <option value="이벤트 및 프로모션 홍보">이벤트 및 프로모션 홍보</option>
                </select>
              </div>

              <div>
                <label htmlFor="adPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                  광고 플랫폼 <span className="text-red-500">*</span>
                </label>
                <select
                  id="adPlatform"
                  name="adInfo.adPlatform"
                  value={formData.adInfo.adPlatform}
                  onChange={handleLocalInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.adPlatform ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">플랫폼을 선택하세요</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="페이스북">페이스북</option>
                  <option value="유튜브">유튜브</option>
                </select>
              </div>

              <div>
                <label htmlFor="adTarget" className="block text-sm font-medium text-gray-700 mb-1">
                  광고 타겟 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="adTarget"
                  name="adInfo.adTarget"
                  value={formData.adInfo.adTarget}
                  onChange={handleLocalInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.adTarget ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="타겟 고객층을 구체적으로 입력하세요 (예: 20-30대 직장인 여성)"
                />
              </div>

              {/* 광고 시간 선택 */}
              <div>
                <label htmlFor="adDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  광고 시간 <span className="text-red-500">*</span>
                </label>
                <select
                  id="adDuration"
                  name="adInfo.adDuration"
                  value={formData.adInfo.adDuration}
                  onChange={handleLocalInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.adDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">광고 시간을 선택하세요</option>
                  <option value="15초">15초</option>
                  <option value="30초">30초</option>
                  <option value="45초">45초</option>
                  <option value="60초">60초</option>
                </select>
              </div>
            </div>

            {/* 오른쪽: 추가 정보 입력란 (크게) */}
            <div className="flex flex-col">
              <div className="flex-1">
                <label htmlFor="adAdditionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  광고 요구사항 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="adAdditionalInfo"
                  name="adInfo.additionalInfo"
                  value={formData.adInfo.additionalInfo}
                  onChange={handleLocalInputChange}
                  rows={10}
                  className={`w-full h-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    validationErrors.additionalInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="광고에서 강조하고 싶은 포인트나 특별한 요구사항을 자세히 입력하세요&#10;&#10;(홍보하고자 하는 제품명을 입력하고 구체적으로 작성할수록, 보다 명확한 시나리오 설정에 도움이 됩니다)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={async () => {
              const { isValid, errors } = validateForm();
              if (!isValid) {
                focusFirstErrorField(errors);
                return;
              }
              
              await generateScenarios();
              if (!error) {
                setActiveStep(2);
              }
            }}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '시나리오 생성 중...' : '다음 단계'}
            <ArrowRight size={16} className="ml-2"/>
          </button>
        </div>
      </div>
    </div>
  );
};