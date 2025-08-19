// src/pages/SnsPostService/components/PostGeneratorForm.jsx
import React, { useState } from "react";
import { Sparkles, RefreshCw, Upload, X, Image, Video } from "lucide-react";
import { FormField } from "../../../components/FormField";
import { INDUSTRY_OPTIONS } from "../../../const/industries";
import { TagInput } from "./TagInput";

const SNS_PLATFORMS = [
  { value: "instagram", label: "인스타그램" },
  { value: "facebook", label: "페이스북" },
  { value: "youtube", label: "유튜브" },
];

export function PostGeneratorForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    content_data: null,
    sns_platform: "",
    business_type: "",
    customBusinessType: "",
    location: "",
    user_keywords: [],
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 타입 검증
      const allowedTypes = [
        // 이미지
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/heic",
        "image/heif",
        // 비디오
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/webm",
        "video/x-matroska",
        "video/mpeg",
        "video/3gpp",
        "video/ogg",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          content_data:
            "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, MP4, MOV, AVI만 지원)",
        }));
        return;
      }

      // 파일 크기 검증 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          content_data: "파일 크기는 50MB 이하여야 합니다.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        content_data: file,
      }));

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview({
          url: e.target.result,
          type: file.type.startsWith("image/") ? "image" : "video",
          name: file.name,
        });
      };
      reader.readAsDataURL(file);

      // 에러 제거
      if (errors.content_data) {
        setErrors((prev) => ({
          ...prev,
          content_data: null,
        }));
      }
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      content_data: null,
    }));
    setFilePreview(null);
  };

  const handleKeywordsChange = (keywords) => {
    setFormData((prev) => ({
      ...prev,
      user_keywords: keywords,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.content_data) {
      newErrors.content_data = "이미지 또는 비디오 파일을 업로드해주세요";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 파일을 Base64로 변환
      let contentDataString = "";
      if (formData.content_data) {
        contentDataString = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // data:image/jpeg;base64,... 형태
          reader.onerror = reject;
          reader.readAsDataURL(formData.content_data);
        });
      }

      // JSON 객체로 전송 (백엔드 DTO에 맞춤)
      const submitData = {
        content_data: contentDataString, // Base64 문자열
        sns_platform: formData.sns_platform,
        business_type:
          formData.business_type === "OTHER"
            ? formData.customBusinessType
            : formData.business_type,
        user_keywords: formData.user_keywords,
        location: formData.location || undefined,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("파일 처리 실패:", error);
      setErrors((prev) => ({
        ...prev,
        content_data: "파일 처리에 실패했습니다.",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Sparkles size={20} className="text-purple-600 mr-2" />
        SNS 게시글 생성
      </h3>

      {/* 파일 업로드 영역 */}
      <div>
        <label className="block text-sm font-black text-gray-800 mb-2 tracking-wide">
          콘텐츠 데이터 <span className="text-red-500 ml-1 font-black">*</span>
        </label>

        {!filePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="content_data"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="content_data" className="cursor-pointer">
              <Upload size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                이미지 또는 비디오를 업로드하세요
              </p>
              <p className="text-sm text-gray-500 mb-4">
                JPG, PNG, GIF, MP4, MOV, AVI 파일 지원 (최대 50MB)
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                <Upload size={20} className="mr-2" />
                파일 선택
              </div>
            </label>
          </div>
        ) : (
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {filePreview.type === "image" ? (
                  <Image size={20} className="text-green-600 mr-2" />
                ) : (
                  <Video size={20} className="text-blue-600 mr-2" />
                )}
                <span className="font-medium text-gray-800">
                  {filePreview.name}
                </span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {filePreview.type === "image" ? (
              <img
                src={filePreview.url}
                alt="미리보기"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <video
                src={filePreview.url}
                controls
                className="w-full h-48 rounded-lg"
              />
            )}
          </div>
        )}

        {errors.content_data && (
          <p className="mt-2 text-sm text-red-600 font-black flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.content_data}
          </p>
        )}
      </div>

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
            게시글 생성 중...
          </>
        ) : (
          <>
            <Sparkles size={20} className="mr-2" />
            게시글 생성하기
          </>
        )}
      </button>
    </form>
  );
}
