import { Upload } from 'lucide-react';
import React from 'react';

export const ContentUploadButton = ({ 
  uploading, 
  onFileUpload, 
  className = "" 
}) => {
  return (
    <label className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${className}`}>
      <Upload size={16} />
      {uploading ? '업로드 중...' : '파일 업로드하기'}
      <input
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={onFileUpload}
        disabled={uploading}
      />
    </label>
  );
};
