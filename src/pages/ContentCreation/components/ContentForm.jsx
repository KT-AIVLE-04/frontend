import { FormField } from '../../../components';

export const ContentForm = ({ 
  contentType, 
  stores, 
  scenarios, 
  formData, 
  setFormData, 
  handleInputChange, 
  handleCreateContent, 
  loading 
}) => {
  if (contentType !== 'video') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">이 기능은 현재 숏폼 영상 생성만 지원합니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">콘텐츠 정보 입력</h3>
        <div className="space-y-4">
          <FormField
            label="매장 선택"
            name="storeId"
            type="select"
            value={formData.storeId}
            onChange={handleInputChange}
            placeholder="매장을 선택하세요"
            required
            options={stores.map(store => ({
              value: store.id,
              label: store.name
            }))}
          />
          <FormField
            label="시나리오 선택"
            name="scenarioId"
            type="select"
            value={formData.scenarioId}
            onChange={handleInputChange}
            placeholder="시나리오를 선택하세요"
            required
            options={scenarios.map(scenario => ({
              value: scenario.id,
              label: scenario.title
            }))}
          />
          <FormField
            label="추가 정보"
            name="additionalInfo"
            type="textarea"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="추가로 원하는 내용이나 특별한 요구사항이 있다면 입력해주세요"
            rows={4}
          />
          <div className="flex justify-end pt-4">
            <button
              onClick={handleCreateContent}
              disabled={loading || !formData.storeId || !formData.scenarioId}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '콘텐츠 생성하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 