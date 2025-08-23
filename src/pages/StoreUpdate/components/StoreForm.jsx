import { MapPin } from 'lucide-react';
import React from 'react';
import { Alert, Button, FormField } from '../../../components';
import { INDUSTRY_OPTIONS } from '../../../const/industries';

export function StoreForm({
  formData,
  setFormData,
  handleSubmit,
  handleInputChange,
  handleContactChange,
  handleAddressSearch,
  loading,
  error,
  onCancel,
  isEditMode = false
}) {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormField
        label="매장명"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="매장명을 입력하세요"
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          매장 주소
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="주소 찾기를 클릭하여 주소를 입력하세요"
            required
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <Button
            type="button"
            onClick={handleAddressSearch}
            icon={MapPin}
            className="px-4 py-2"
          >
            주소 찾기
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          매장 연락처
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleContactChange}
          placeholder="02-1234-5678 또는 010-1234-5678"
          maxLength="13"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <FormField
        label="사업자등록번호"
        name="businessNumber"
        type="text"
        value={formData.businessNumber}
        onChange={handleInputChange}
        placeholder="사업자등록번호 (선택사항)"
      />

      <FormField
        label="매장 업종"
        name="industry"
        type="select"
        value={formData.industry}
        onChange={handleInputChange}
        placeholder="업종을 선택하세요"
        required
        options={INDUSTRY_OPTIONS}
      />

      {error && (
        <Alert
          type="error"
          title="오류"
          message={error}
        />
      )}

      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="mr-2!"
        >
          취소
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={loading}
        >
          {loading ? '저장 중...' : (isEditMode ? '매장 수정' : '매장 추가')}
        </Button>
      </div>
    </form>
  );
} 