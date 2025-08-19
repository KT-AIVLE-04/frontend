// src/pages/SnsPostService/components/HashtagGeneratorForm.jsx
import React, { useState } from "react";
import { Hash, RefreshCw } from "lucide-react";
import { FormField } from "../../../components/FormField";
import { INDUSTRY_OPTIONS } from "../../../const/industries";
import { TagInput } from "./TagInput";

const SNS_PLATFORMS = [
  { value: "instagram", label: "인스타그램" },
  { value: "facebook", label: "페이스북" },
  { value: "youtube", label: "유튜브" },
];

export function HashtagGeneratorForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    post_title: "",
    post_content: "",
    sns_platform: "",
    business_type: "",
    customBusinessType: "",
    location: "",
    user_keywords: [],
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 기타가 아닌 다른 업종을 선택했을 때 직접 입력 필드 초기화
    if (name === "business_type" && value !== "OTHER") {
      setFormData((prev) => ({
        ...prev,
        customBusinessType: "",
      }));
    }

    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleKeywordsChange = (keywords) => {
    setFormData((prev) => ({
      ...prev,
      user_keywords: keywords,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.post_title.trim()) {
      newErrors.post_title = "게시물 제목을 입력해주세요";
    }

    if (!formData.post_content.trim()) {
      newErrors.post_content = "게시물 본문을 입력해주세요";
    }

    if (!formData.sns_platform) {
      newErrors.sns_platform = "SNS 플랫폼을 선택해주세요";
    }

    if (!formData.business_type) {
      newErrors.business_type = "업종을 선택해주세요";
    } else if (
      formData.business_type === "OTHER" &&
      !formData.customBusinessType.trim()
    ) {
      newErrors.customBusinessType = "기타 업종을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      post_title: formData.post_title,
      post_content: formData.post_content,
      sns_platform: formData.sns_platform,
      business_type:
        formData.business_type === "OTHER"
          ? formData.customBusinessType
          : formData.business_type,
      user_keywords: formData.user_keywords,
      location: formData.location || undefined,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Hash size={20} className="text-purple-600 mr-2" />
        해시태그 생성
      </h3>

      <FormField
        label="게시물 제목"
        name="post_title"
        value={formData.post_title}
        onChange={handleInputChange}
        placeholder="게시물 제목을 입력하세요"
        required
        error={errors.post_title}
      />

      <FormField
        label="게시물 본문"
        name="post_content"
        type="textarea"
        value={formData.post_content}
        onChange={handleInputChange}
        placeholder="게시물 본문을 입력하세요"
        required
        error={errors.post_content}
      />

      <FormField
        label="SNS 플랫폼"
        name="sns_platform"
        type="select"
        value={formData.sns_platform}
        onChange={handleInputChange}
        placeholder="플랫폼을 선택하세요"
        options={SNS_PLATFORMS}
        required
        error={errors.sns_platform}
      />

      <FormField
        label="업종 선택"
        name="business_type"
        type="select"
        value={formData.business_type}
        onChange={handleInputChange}
        placeholder="업종을 선택하세요"
        options={INDUSTRY_OPTIONS}
        required
        error={errors.business_type}
      />

      {/* 기타 업종 선택 시에만 직접 입력 필드 표시 */}
      {formData.business_type === "OTHER" && (
        <FormField
          label="업종 직접 입력"
          name="customBusinessType"
          value={formData.customBusinessType}
          onChange={handleInputChange}
          placeholder="업종을 직접 입력하세요"
          required
          error={errors.customBusinessType}
        />
      )}

      <FormField
        label="위치 (선택사항)"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="매장 위치나 지역을 입력하세요"
      />

      <div>
        <label className="block text-sm font-black text-gray-800 mb-2 tracking-wide">
          키워드 태그 (선택사항)
        </label>
        <TagInput
          tags={formData.user_keywords}
          onChange={handleKeywordsChange}
          placeholder="키워드를 입력하고 Enter를 누르세요"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="mr-2 animate-spin" />
            해시태그 생성 중...
          </>
        ) : (
          <>
            <Hash size={20} className="mr-2" />
            해시태그 생성하기
          </>
        )}
      </button>
    </form>
  );
}
