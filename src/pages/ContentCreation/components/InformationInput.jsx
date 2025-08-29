import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useValidation } from '../hooks/useValidation';
import { useInformationForm } from '../hooks/useInformationForm';
import { StoreInfoSection } from './StoreInfoSection';
import { AdInfoSection } from './AdInfoSection';

export const InformationInput = () => {
  const { validationErrors, validateForm, focusFirstErrorField, clearValidationError } = useValidation();
  const { 
    formData, 
    loading, 
    error, 
    brandConceptInput, 
    generateScenarios, 
    setActiveStep, 
    createWrappedHandlers 
  } = useInformationForm();

  const {
    handleLocalInputChange,
    handleBrandConceptInputChange,
    handleLocalAddBrandConcept,
    handleLocalFileSelect
  } = createWrappedHandlers(clearValidationError);

  const handleSubmit = async () => {
    const { isValid, errors } = validateForm(formData);
    if (!isValid) {
      focusFirstErrorField(errors);
      return;
    }
    
    await generateScenarios();
    if (!error) {
      setActiveStep(2);
    }
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
      
      <div className={loading ? 'blur-sm pointer-events-none' : ''}>
        <StoreInfoSection 
          validationErrors={validationErrors}
          brandConceptInput={brandConceptInput}
          handleBrandConceptInputChange={handleBrandConceptInputChange}
          handleLocalAddBrandConcept={handleLocalAddBrandConcept}
          handleLocalFileSelect={handleLocalFileSelect}
        />
        
        <AdInfoSection 
          validationErrors={validationErrors}
          formData={formData}
          handleLocalInputChange={handleLocalInputChange}
        />
        
        {/* 다음 단계 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
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