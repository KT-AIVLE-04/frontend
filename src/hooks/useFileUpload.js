import { useCallback, useState } from 'react';

/**
 * 파일 업로드를 위한 커스텀 훅
 * @param {Object} options - 파일 업로드 옵션
 * @param {number} [options.maxFileSize=10485760] - 최대 파일 크기 (10MB)
 * @param {string[]} [options.allowedTypes=[]] - 허용된 파일 타입들
 * @param {boolean} [options.multiple=false] - 다중 파일 업로드 여부
 * @returns {Object} 파일 업로드 상태와 함수들
 * @returns {File[]} returns.files - 업로드된 파일들
 * @returns {boolean} returns.uploading - 업로드 중 상태
 * @returns {string|null} returns.error - 에러 메시지
 * @returns {Function} returns.addFiles - 파일 추가 함수 (files) => void
 * @returns {Function} returns.removeFile - 파일 제거 함수 (index) => void
 * @returns {Function} returns.clearFiles - 모든 파일 제거 함수 () => void
 * @returns {Function} returns.uploadFiles - 파일 업로드 함수 (uploadFunction) => Promise<any[]>
 * @returns {Function} returns.getTotalSize - 전체 파일 크기 계산 함수 () => number
 * @returns {Function} returns.formatFileSize - 파일 크기 포맷 함수 (bytes) => string
 */
export const useFileUpload = (options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [],
    multiple = false
  } = options;

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    // 파일 크기 검증
    if (file.size > maxFileSize) {
      throw new Error(`파일 크기가 너무 큽니다. 최대 ${maxFileSize / 1024 / 1024}MB까지 업로드 가능합니다.`);
    }

    // 파일 타입 검증
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new Error(`지원하지 않는 파일 형식입니다. 지원 형식: ${allowedTypes.join(', ')}`);
    }

    return true;
  }, [maxFileSize, allowedTypes]);

  const addFiles = useCallback((newFiles) => {
    try {
      setError(null);
      const fileArray = Array.from(newFiles);
      
      // 각 파일 검증
      fileArray.forEach(validateFile);

      if (multiple) {
        setFiles(prev => [...prev, ...fileArray]);
      } else {
        setFiles(fileArray);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [multiple, validateFile]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const uploadFiles = useCallback(async (uploadFunction) => {
    if (files.length === 0) {
      setError('업로드할 파일이 없습니다.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const results = [];
      for (const file of files) {
        const result = await uploadFunction(file);
        results.push(result);
      }

      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [files]);

  const getTotalSize = useCallback(() => {
    return files.reduce((total, file) => total + file.size, 0);
  }, [files]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    files,
    uploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    getTotalSize,
    formatFileSize,
    hasFiles: files.length > 0
  };
};
