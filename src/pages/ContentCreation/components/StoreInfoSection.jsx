import { Upload, X, Trash2 } from 'lucide-react';
import { useShortformGeneration } from '../context/ShortformGenerationContext';

export const StoreInfoSection = ({ 
  validationErrors, 
  brandConceptInput,
  handleBrandConceptInputChange,
  handleLocalAddBrandConcept,
  handleLocalFileSelect 
}) => {
  const {
    formData,
    setFileInputRef,
    handleRemoveBrandConcept,
    formatFileSize,
    handleRemoveFile,
    handleFileButtonClick
  } = useShortformGeneration();

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
        📍 매장 정보 입력
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
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

          <div>
            <label htmlFor="brandConcept" className="block text-sm font-medium text-gray-700 mb-1">
              브랜드 컨셉 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
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

        <div className="flex flex-col h-full">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            이미지 업로드 <span className="text-red-500">*</span> ({formData.storeInfo.referenceFiles.length}/5)
          </h4>

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
            <div className="flex-1 min-h-[240px]">
              <div className="grid grid-cols-5 gap-2 mb-3">
                {formData.storeInfo.referenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="aspect-square relative w-full h-40">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </div>
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
  );
};