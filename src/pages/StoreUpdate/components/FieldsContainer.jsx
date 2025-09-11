import { MapPin } from 'lucide-react';
import React from 'react';
import { Button, FieldError, FieldLabel, Input } from '../../../components/atoms';
import { FormField } from '../../../components/molecules';

export function FieldsContainer({
  formData,
  handleChange,
  handleBlur,
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
        error={errors.name}
        validate={validationSchema.name}
        placeholder="매장명을 입력하세요"
        required
      />

      <div className="mb-6">
        <FieldLabel
          label="매장 주소"
          name="address"
          required={true}
          hasError={errors.address}
        />
        <div className="flex gap-2">
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소 찾기를 클릭하여 주소를 입력하세요"
            required
            readOnly
            error={errors.address}
            className="flex-1"
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
        <FieldError error={errors.address} />
      </div>

      <FormField
        label="매장 연락처"
        name="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phoneNumber}
        validate={validationSchema.phoneNumber}
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
        error={errors.businessNumber}
        validate={validationSchema.businessNumber}
        placeholder="사업자등록번호 (선택사항)"
      />

      <FormField
        label="매장 업종"
        name="industry"
        type="select"
        value={formData.industry}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.industry}
        validate={validationSchema.industry}
        placeholder="업종을 선택하세요"
        required
        options={industryOptions}
      />
    </div>
  );
}
