import { Button, FormField } from '../../../components';

export const AddStoreForm = ({ 
  showAddStore, 
  setShowAddStore, 
  formData, 
  setFormData, 
  handleSubmit, 
  handleInputChange 
}) => {
  const categoryOptions = [
    { value: "cafe", label: "카페/디저트" },
    { value: "restaurant", label: "음식점" },
    { value: "fashion", label: "패션/의류" },
    { value: "beauty", label: "미용/뷰티" },
    { value: "other", label: "기타" }
  ];

  if (!showAddStore) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4">새 매장 추가</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="매장명"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="매장명을 입력하세요"
          required
        />
        <FormField
          label="매장 주소"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="매장 주소를 입력하세요"
          required
        />
        <FormField
          label="매장 연락처"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="매장 연락처를 입력하세요"
          required
        />
        <FormField
          label="매장 업종"
          name="category"
          type="select"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="업종을 선택하세요"
          required
          options={categoryOptions}
        />
        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowAddStore(false)}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}; 