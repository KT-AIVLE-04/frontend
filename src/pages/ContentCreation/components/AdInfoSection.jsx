export const AdInfoSection = ({ 
  validationErrors, 
  formData,
  handleLocalInputChange 
}) => {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
        📍 광고 정보 입력
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
};