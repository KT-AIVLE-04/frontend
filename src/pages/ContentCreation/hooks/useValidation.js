import { useState } from 'react';

export const useValidation = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};
    
    if (formData.storeInfo.brandConcepts.length === 0) {
      errors.brandConcepts = true;
    }
    
    if (formData.storeInfo.referenceFiles.length === 0) {
      errors.referenceFiles = true;
    }
    
    if (!formData.adInfo.adType) {
      errors.adType = true;
    }
    
    if (!formData.adInfo.adPlatform) {
      errors.adPlatform = true;
    }
    
    if (!formData.adInfo.adTarget?.trim()) {
      errors.adTarget = true;
    }
    
    if (!formData.adInfo.adDuration) {
      errors.adDuration = true;
    }
    
    if (!formData.adInfo.additionalInfo?.trim()) {
      errors.additionalInfo = true;
    }
    
    setValidationErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const focusFirstErrorField = (errors) => {
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
          }, 100);
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

  return {
    validationErrors,
    validateForm,
    focusFirstErrorField,
    clearValidationError
  };
};