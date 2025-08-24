import { MapPin } from 'lucide-react';
import React from 'react';
import { Button } from '../../../components/atoms';
import { FormField } from '../../../components/molecules';

export function FieldsContainer({
  formData,
  handleChange,
  handleBlur,
  touched,
  errors,
  handleAddressSearch,
  validationSchema,
  industryOptions
}) {
  return (
    <div className="space-y-10">
      <FormField
        label="매장명"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        validate={validationSchema.name}
        touched={touched}
        placeholder="매장명을 입력하세요"
        required
      />

      <div className="space-y-2">
        <label className={`block text-sm font-medium ${touched.address && errors.address ? 'text-red-600' : 'text-gray-700'}`}>
          매장 주소 *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="주소 찾기를 클릭하여 주소를 입력하세요"
            required
            readOnly
            className={`flex-1 px-5 py-4 border-2 rounded-2xl bg-gray-100 cursor-not-allowed transition-all duration-300 ${
              touched.address && errors.address 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-400 hover:border-blue-400'
            }`}
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
        {touched.address && errors.address && (
          <p className="mt-2 text-sm text-red-600 font-black flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.address}
          </p>
        )}
      </div>

      <FormField
        label="매장 연락처"
        name="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phoneNumber && errors.phoneNumber}
        validate={validationSchema.phoneNumber}
        touched={touched}
        placeholder="02-1234-5678 또는 010-1234-5678"
        required
      />

      <FormField
        label="사업자등록번호"
        name="businessNumber"
        type="text"
        value={formData.businessNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.businessNumber && errors.businessNumber}
        validate={validationSchema.businessNumber}
        touched={touched}
        placeholder="사업자등록번호 (선택사항)"
      />

      <FormField
        label="매장 업종"
        name="industry"
        type="select"
        value={formData.industry}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.industry && errors.industry}
        validate={validationSchema.industry}
        touched={touched}
        placeholder="업종을 선택하세요"
        required
        options={industryOptions}
      />
    </div>
  );
}
