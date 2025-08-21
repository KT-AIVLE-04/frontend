import { useShortformGeneration } from '../context/ShortformGenerationContext';
import { shortApi } from "../../../api/short.js";

export const useInformationForm = () => {
  const {
    formData,
    loading,
    setLoading,
    error,
    setError,
    brandConceptInput,
    setBrandConceptInput,
    setActiveStep,
    setScenarios,
    setSessionId,
    handleInputChange,
    handleAddBrandConcept,
    handleFileSelect
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

  const createWrappedHandlers = (clearValidationError) => ({
    handleLocalInputChange: (e) => {
      const { name } = e.target;
      const fieldName = name.split('.')[1];
      clearValidationError(fieldName);
      handleInputChange(e);
    },

    handleBrandConceptInputChange: (e) => {
      setBrandConceptInput(e.target.value);
      if (e.target.value.trim() || formData.storeInfo.brandConcepts.length > 0) {
        clearValidationError('brandConcepts');
      }
    },

    handleLocalAddBrandConcept: (e) => {
      handleAddBrandConcept(e);
      clearValidationError('brandConcepts');
    },

    handleLocalFileSelect: async (e) => {
      await handleFileSelect(e);
      clearValidationError('referenceFiles');
    }
  });

  return {
    formData,
    loading,
    error,
    brandConceptInput,
    generateScenarios,
    setActiveStep,
    createWrappedHandlers
  };
};