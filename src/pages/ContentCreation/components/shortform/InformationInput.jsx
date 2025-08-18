import { ArrowRight, Upload, X, Trash2 } from 'lucide-react';
import React from 'react';
import { useShortformGeneration } from '../../context/ShortformGenerationContext';
import { contentApi } from '../../../../api/content';

export const InformationInput = () => {
  const {
    formData,
    setFormData,
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
      
      const response = await contentApi.createScenarios(selectedStoreId, scenarioData);
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

  const isFormValid = () => {
    return (
      formData.storeId &&
      formData.storeInfo.brandConcepts.length > 0 &&
      formData.storeInfo.referenceFiles.length > 0 &&
      formData.adInfo.adType &&
      formData.adInfo.adPlatform &&
      formData.adInfo.adTarget &&
      formData.adInfo.adDuration
    );
  };

  return (
    <div>
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
                브랜드 컨셉 *
              </label>
              <div className="space-y-3">
                {/* 입력 필드 */}
                <input 
                  id="brandConcept" 
                  type="text"
                  value={brandConceptInput}
                  onChange={(e) => setBrandConceptInput(e.target.value)}
                  onKeyDown={handleAddBrandConcept}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          <X size={14} />
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
              이미지 업로드 * ({formData.storeInfo.referenceFiles.length}/5)
            </h4>
            
            {/* 파일이 없는 경우 업로드 영역 */}
            {formData.storeInfo.referenceFiles.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex-1 flex flex-col justify-center min-h-[240px]">
                <Upload size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">
                  매장 이미지나 제품 사진을 업로드하세요
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  JPG, PNG 파일 지원 (최대 50MB, 최대 5개)
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
                  onChange={handleFileSelect}
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
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                          >
                            <Trash2 size={12} />
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
                  onChange={handleFileSelect}
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
                광고 타입 *
              </label>
              <select 
                id="adType" 
                name="adInfo.adType"
                value={formData.adInfo.adType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">광고 타입을 선택하세요</option>
                <option value="제품 홍보">제품 홍보</option>
                <option value="브랜드 홍보">브랜드 홍보</option>
                <option value="이벤트 및 프로모션 홍보">이벤트 및 프로모션 홍보</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="adPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                광고 플랫폼 *
              </label>
              <select 
                id="adPlatform" 
                name="adInfo.adPlatform"
                value={formData.adInfo.adPlatform}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">플랫폼을 선택하세요</option>
                <option value="인스타그램">인스타그램</option>
                <option value="페이스북">페이스북</option>
                <option value="유튜브">유튜브</option>
              </select>
            </div>

            <div>
              <label htmlFor="adTarget" className="block text-sm font-medium text-gray-700 mb-1">
                광고 타겟 *
              </label>
              <textarea 
                id="adTarget" 
                name="adInfo.adTarget"
                value={formData.adInfo.adTarget}
                onChange={handleInputChange}
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="타겟 고객층을 구체적으로 입력하세요 (예: 20-30대 직장인 여성)"
              />
            </div>

            {/* 광고 시간 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                광고 시간 *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    adInfo: { ...prev.adInfo, adDuration: '15초' }
                  }))}
                  className={`flex-1 py-3 px-4 border rounded-md text-sm font-medium transition-colors ${
                    formData.adInfo.adDuration === '15초'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  15초
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    adInfo: { ...prev.adInfo, adDuration: '30초' }
                  }))}
                  className={`flex-1 py-3 px-4 border rounded-md text-sm font-medium transition-colors ${
                    formData.adInfo.adDuration === '30초'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  30초
                </button>
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 추가 정보 입력란 (크게) */}
          <div className="flex flex-col">
            <div className="flex-1">
              <label htmlFor="adAdditionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                광고 요구사항
              </label>
              <textarea 
                id="adAdditionalInfo" 
                name="adInfo.additionalInfo"
                value={formData.adInfo.additionalInfo}
                onChange={handleInputChange}
                rows={10} 
                className="w-full h-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="광고에서 강조하고 싶은 포인트나 특별한 요구사항을 자세히 입력하세요&#10;&#10;예시:&#10;- 젊고 트렌디한 분위기 강조&#10;- 할인 이벤트 정보 포함&#10;- 매장 위치의 접근성 강조&#10;- 제품의 특별한 장점이나 차별화 포인트"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 다음 단계 버튼 */}
      <div className="flex justify-end">
        <button 
          onClick={async () => {
            await generateScenarios();
            if (!error) {
              setActiveStep(2);
            }
          }}
          disabled={loading || !isFormValid()}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '시나리오 생성 중...' : '다음 단계'}
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};