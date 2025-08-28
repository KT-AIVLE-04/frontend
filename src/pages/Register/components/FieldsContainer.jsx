import React from 'react';
import { FormField } from '../../../components/molecules';
import { ageOptions } from './AgeOptions';

export function FieldsContainer({
  formData,
  handleChange,
  handleBlur,
  touched,
  errors,
  validationSchema
}) {
  return (
    <div className="space-y-6">
      <FormField
        label="이름"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        validate={validationSchema.name}
        touched={touched}
        placeholder="이름을 입력하세요"
        required
      />

      <FormField
        label="이메일"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        validate={validationSchema.email}
        touched={touched}
        placeholder="이메일 주소를 입력하세요"
        required
      />

      <FormField
        label="전화번호"
        name="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phoneNumber && errors.phoneNumber}
        validate={validationSchema.phoneNumber}
        touched={touched}
        placeholder="전화번호를 입력하세요"
        required
      />

      <FormField
        label="연령대"
        name="age"
        type="select"
        value={formData.age}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.age && errors.age}
        validate={validationSchema.age}
        touched={touched}
        placeholder="연령대를 선택하세요"
        required
        options={ageOptions}
      />

      <FormField
        label="비밀번호"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        validate={validationSchema.password}
        touched={touched}
        placeholder="비밀번호를 입력하세요"
        required
      />
    </div>
  );
}
