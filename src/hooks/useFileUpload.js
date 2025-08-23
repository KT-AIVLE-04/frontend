import { useCallback, useState } from 'react';

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
