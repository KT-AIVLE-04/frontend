import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { storeApi } from "../../../api/store";

const ShortformGenerationContext = createContext();

export const useShortformGeneration = () => {
  const context = useContext(ShortformGenerationContext);
  if (!context) {
    throw new Error(
      "useShortformGeneration must be used within a ShortformGenerationProvider"
    );
  }
  return context;
};

export const ShortformGenerationProvider = ({ children }) => {
  const selectedStoreId = useSelector((state) => state.auth.selectedStoreId);
  const [activeStep, setActiveStep] = useState(1);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [formData, setFormData] = useState({
    storeInfo: {
      storeName: "",
      businessType: "",
      brandConcepts: [],
      referenceFiles: [],
    },
    adInfo: {
      adType: "",
      adTarget: "",
      adPlatform: "",
      adDuration: "15초",
      additionalInfo: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brandConceptInput, setBrandConceptInput] = useState("");
  const [fileInputRef, setFileInputRef] = useState(null);

  // API 응답에 맞는 state 변수들
  const [jobId, setJobId] = useState("");
  const [jobStatus, setJobStatus] = useState(""); // QUEUED, RUNNING, SUCCEEDED, FAILED, CANCELED
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(0);
  const [videoKey, setVideoKey] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [jobError, setJobError] = useState("");

  useEffect(() => {
    if (selectedStoreId) {
      fetchCurrentStoreInfo(selectedStoreId);
      setFormData((prev) => ({ ...prev, storeId: selectedStoreId }));
    }
  }, [selectedStoreId]);

  const fetchCurrentStoreInfo = async (storeId) => {
    try {
      const response = await storeApi.getStore(storeId);
      const storeInfo = response.data.result;

      if (storeInfo) {
        setFormData((prev) => ({
          ...prev,
          storeInfo: {
            ...prev.storeInfo,
            storeName: storeInfo.name,
            businessType: storeInfo.industry,
          },
        }));
      }
    } catch (error) {
      console.error("매장 정보 로딩 실패:", error);
      setError("매장 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [category, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddBrandConcept = (e) => {
    if (
      e.key === "Enter" &&
      !e.nativeEvent.isComposing &&
      brandConceptInput.trim()
    ) {
      e.preventDefault();
      const newConcept = brandConceptInput.trim();

      if (!formData.storeInfo.brandConcepts.includes(newConcept)) {
        setFormData((prev) => ({
          ...prev,
          storeInfo: {
            ...prev.storeInfo,
            brandConcepts: [...prev.storeInfo.brandConcepts, newConcept],
          },
        }));
      }

      setBrandConceptInput("");
    }
  };

  const handleRemoveBrandConcept = (conceptToRemove) => {
    setFormData((prev) => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        brandConcepts: prev.storeInfo.brandConcepts.filter(
          (concept) => concept !== conceptToRemove
        ),
      },
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = [];
    let errorMessage = "";

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        errorMessage = "이미지 파일만 업로드 가능합니다.";
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        errorMessage = "파일 크기는 50MB 이하여야 합니다.";
        continue;
      }

      validFiles.push(file);
    }

    const totalFiles =
      formData.storeInfo.referenceFiles.length + validFiles.length;
    if (totalFiles > 5) {
      alert("이미지는 최대 5개까지 업로드 가능합니다.");
      return;
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const newFiles = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        referenceFiles: [...prev.storeInfo.referenceFiles, ...newFiles],
      },
    }));

    e.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setFormData((prev) => {
      const updatedFiles = prev.storeInfo.referenceFiles.filter(
        (file) => file.id !== fileId
      );
      const fileToRemove = prev.storeInfo.referenceFiles.find(
        (file) => file.id === fileId
      );
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return {
        ...prev,
        storeInfo: {
          ...prev.storeInfo,
          referenceFiles: updatedFiles,
        },
      };
    });
  };

  const handleFileButtonClick = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  const resetForm = () => {
    setActiveStep(1);
    setScenarios([]);
    setSelectedScenarioId(null);
    setSessionId(null);
    setFormData({
      storeInfo: {
        storeName: "",
        businessType: "",
        brandConcepts: [],
        referenceFiles: [],
      },
      adInfo: {
        adType: "",
        adTarget: "",
        adPlatform: "",
        adDuration: "15초",
        additionalInfo: "",
      },
    });
    setLoading(false);
    setError(null);
    setBrandConceptInput("");
    setFileInputRef(null);
    // API 관련 state 초기화
    setJobId("");
    setJobStatus("");
    setLocation("");
    setProgress(0);
    setVideoUrl("");
    setJobError("");
  };

  const resetToInputStep = () => {
    setActiveStep(1);
    setScenarios([]);
    setSelectedScenarioId(null);
    setSessionId(null);
    setError(null);
    setLoading(false);
    // API 관련 state 초기화
    setJobId("");
    setJobStatus("");
    setLocation("");
    setProgress(0);
    setVideoUrl("");
    setJobError("");
    // formData는 유지
  };

  const value = {
    // State
    selectedStoreId,
    activeStep,
    setActiveStep,
    scenarios,
    setScenarios,
    selectedScenarioId,
    setSelectedScenarioId,
    sessionId,
    setSessionId,
    formData,
    setFormData,
    loading,
    setLoading,
    error,
    setError,
    brandConceptInput,
    setBrandConceptInput,
    fileInputRef,
    setFileInputRef,

    // API 관련 state
    jobId,
    setJobId,
    jobStatus,
    setJobStatus,
    location,
    setLocation,
    progress,
    setProgress,
    videoKey,
    setVideoKey,
    videoUrl,
    setVideoUrl,
    jobError,
    setJobError,

    // Functions
    handleInputChange,
    handleAddBrandConcept,
    handleRemoveBrandConcept,
    formatFileSize,
    handleFileSelect,
    handleRemoveFile,
    handleFileButtonClick,
    resetForm,
    resetToInputStep,
    fetchCurrentStoreInfo,
  };

  return (
    <ShortformGenerationContext.Provider value={value}>
      {children}
    </ShortformGenerationContext.Provider>
  );
};
