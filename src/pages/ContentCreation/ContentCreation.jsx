import { ArrowRight, CheckCircle, Clock, Sparkles, Upload, X, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { contentApi } from '../../api/content';
import { storeApi } from '../../api/store';
import { Container } from '../../components/Container';
import { ErrorPage } from '../../components/ErrorPage';
import { ContentTypeSelector } from './components';

export function ContentCreation() {
  const selectedStoreId = useSelector((state) => state.auth.selectedStoreId);
  const [activeStep, setActiveStep] = useState(1);
  const [contentType, setContentType] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({
    // 매장 정보
    storeInfo: {
      storeName: '', // DB에서 가져올 매장 이름
      businessType: '', // DB에서 가져올 업종
      brandConcepts: [], // 사용자 입력 브랜드 컨셉 태그들
      referenceFiles: [] // 참고 자료 파일들
    },
    // 광고 정보
    adInfo: {
      adType: '', 
      adTarget: '', 
      adPlatform: '', 
      adDuration: '15초', // 광고 시간 (15초가 기본값)
      additionalInfo: '' 
    }
  });
  const [loading, setLoading] = useState(false);
  const [contentStatus, setContentStatus] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [error, setError] = useState(null);
  const [brandConceptInput, setBrandConceptInput] = useState(''); // 브랜드 컨셉 입력 필드
  const [fileInputRef, setFileInputRef] = useState(null); // 파일 입력 참조

  useEffect(() => {
    if (contentType === 'video') {
  
    }
  }, [contentType]);

  useEffect(() => {
    if (contentType === 'video' && selectedStoreId) {
      fetchCurrentStoreInfo(selectedStoreId);
      setFormData(prev => ({ ...prev, storeId: selectedStoreId }));
    }
  }, [selectedStoreId, contentType]);

  useEffect(() => {
    if (contentId && activeStep === 3) {
      checkContentStatus();
    }
  }, [contentId, activeStep]);

  // 현재 선택된 매장의 상세 정보를 가져오는 함수
  const fetchCurrentStoreInfo = async (storeId) => {
    try {
      const response = await storeApi.getStore(storeId);
      const storeInfo = response.data.result;
      
      if (storeInfo) {
        // formData의 매장 정보 업데이트
        setFormData(prev => ({
          ...prev,
          storeInfo: {
            ...prev.storeInfo,
            storeName: storeInfo.name,
            businessType: storeInfo.industry
          }
        }));
      }
    } catch (error) {
      console.error('매장 정보 로딩 실패:', error);
      setError('매장 정보를 불러오는데 실패했습니다.');
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

  // 브랜드 컨셉 태그 추가 함수
  const handleAddBrandConcept = (e) => {
    // IME 조합 중일 때는 실행하지 않음 (한국어 입력 이슈 방지)
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && brandConceptInput.trim()) {
      e.preventDefault();
      const newConcept = brandConceptInput.trim();
      
      // 중복 확인
      if (!formData.storeInfo.brandConcepts.includes(newConcept)) {
        setFormData(prev => ({
          ...prev,
          storeInfo: {
            ...prev.storeInfo,
            brandConcepts: [...prev.storeInfo.brandConcepts, newConcept]
          }
        }));
      }
      
      setBrandConceptInput('');
    }
  };

  // 브랜드 컨셉 태그 삭제 함수
  const handleRemoveBrandConcept = (conceptToRemove) => {
    setFormData(prev => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        brandConcepts: prev.storeInfo.brandConcepts.filter(concept => concept !== conceptToRemove)
      }
    }));
  };

  // 파일 크기를 읽기 쉬운 형태로 변환하는 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 선택 처리 함수
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // 파일 유효성 검사
    const validFiles = [];
    let errorMessage = '';

    for (const file of files) {
      // 이미지 파일 확인
      if (!file.type.startsWith('image/')) {
        errorMessage = '이미지 파일만 업로드 가능합니다.';
        continue;
      }

      // 파일 크기 확인 (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        errorMessage = '파일 크기는 50MB 이하여야 합니다.';
        continue;
      }

      validFiles.push(file);
    }

    // 현재 파일 + 새 파일이 5개를 초과하는지 확인
    const totalFiles = formData.storeInfo.referenceFiles.length + validFiles.length;
    if (totalFiles > 5) {
      alert('이미지는 최대 5개까지 업로드 가능합니다.');
      return;
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // 파일 정보를 state에 추가
    const newFiles = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        referenceFiles: [...prev.storeInfo.referenceFiles, ...newFiles]
      }
    }));

    // 파일 input 초기화
    e.target.value = '';
  };

  // 파일 삭제 함수
  const handleRemoveFile = (fileId) => {
    setFormData(prev => {
      const updatedFiles = prev.storeInfo.referenceFiles.filter(file => file.id !== fileId);
      // 삭제된 파일의 preview URL 정리
      const fileToRemove = prev.storeInfo.referenceFiles.find(file => file.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return {
        ...prev,
        storeInfo: {
          ...prev.storeInfo,
          referenceFiles: updatedFiles
        }
      };
    });
  };

  // 파일 선택 버튼 클릭 함수
  const handleFileButtonClick = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  // 시나리오 선택 단계에서 백엔드로 보낼 데이터만 추출하는 함수
  const getScenarioRequestData = () => {
    return {
      // 요구사항에 따라 시나리오 선택 시 보낼 정보만 포함
      additionalInfo: formData.adInfo.additionalInfo, // 추가 정보
      adPlatform: formData.adInfo.adPlatform, // 광고 플랫폼
      adTarget: formData.adInfo.adTarget, // 광고 타겟
      adType: formData.adInfo.adType, // 광고 유형(타입)
      brandConcepts: formData.storeInfo.brandConcepts // 브랜드 컨셉 태그들
    };
  };

  const handleCreateContent = async () => {
    try {
      setLoading(true);
      
      // 업데이트된 데이터 구조로 요청
      const requestData = {
        type: contentType,
        storeId: formData.storeId,
        scenarioId: formData.scenarioId,
        // 시나리오 생성에 필요한 정보들
        ...getScenarioRequestData()
      };

      console.log('콘텐츠 생성 요청 데이터:', requestData);
      
      const response = await contentApi.createContent(requestData);
      
      setContentId(response.data.contentId);
      setActiveStep(3);
    } catch (error) {
      console.error('콘텐츠 생성 실패:', error);
      alert('콘텐츠 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 중첩된 객체 구조를 처리할 수 있는 handleInputChange 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // name이 "storeInfo.brandConcept" 같은 형태인지 확인
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }));
    } else {
      // 기존 방식 (호환성 유지)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  if (error) {
    return <ErrorPage title="데이터 로딩 실패" message={error} />;
  }

  if (!selectedStoreId) {
    return <ErrorPage title="매장이 선택되지 않음" message="먼저 매장을 선택해주세요." />;
  }

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">콘텐츠 제작</h1>
      
      {!contentType && (
        <Container className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-8">
            제작할 콘텐츠 유형을 선택하세요
          </h2>
          <ContentTypeSelector contentType={contentType} setContentType={setContentType} />
        </Container>
      )}

      {contentType === 'video' && (
        <Container className="overflow-hidden">
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
                    onClick={() => setActiveStep(2)}
                    disabled={!formData.storeId || formData.storeInfo.brandConcepts.length === 0 || formData.storeInfo.referenceFiles.length === 0 || !formData.adInfo.adType || !formData.adInfo.adPlatform || !formData.adInfo.adTarget || !formData.adInfo.adDuration}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </Container>
      )}

      {contentType === 'image' && (
        <Container className="overflow-hidden p-6">
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
        </Container>
      )}
    </div>
  );
} 