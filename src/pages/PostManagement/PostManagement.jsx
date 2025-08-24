import {
  Eye,
  FolderOpen,
  Hash,
  Plus,
  Search,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { contentApi } from "../../api/content";
import { snsApi } from "../../api/sns";
import { storeApi } from "../../api/store";
import { EmptyState, ErrorPage, LoadingSpinner } from "../../components";
import { INDUSTRY_OPTIONS } from "../../const/industries";
import { SNS_TYPES } from "../../const/snsTypes";
import { useApi, useConfirm, useForm, useNotification, useSearch } from "../../hooks";
import { Store } from "../../models/Store";
import { ROUTES } from "../../routes/routes";
import { PostDetail, PostManagementCard, SearchFilter } from "./components";

const PostManagement = () => {
  /** ----------------------
   * 상태 관리
   ----------------------- */
  const { selectedStoreId } = useSelector((state) => state.auth); // /src/store/index.js, /src/store/authSlice.js 참고하여 이해

  const [activeTab, setActiveTab] = useState("list");
  const [posts, setPosts] = useState([]);

  const [sortBy, setSortBy] = useState("recent");
  const [selectedPost, setSelectedPost] = useState(null);
  
  // useForm 훅 사용
  const {
    values: post,
    errors: postErrors,
    handleChange: handlePostChange,
    setFieldValue: setPostField,
    resetForm: resetPostForm
  } = useForm({
    title: "",
    description: "",
    tags: []
  });

  const [generatedPost, setGeneratedPost] = useState({
    title: false,
    description: false,
    tags: false,
  });

  const [uploadedContents, setUploadedContents] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedSnsType, setSelectedSnsType] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [showContents, setShowContents] = useState(false);
  const [contentsFilter, setContentsFilter] = useState("all");

  const [selectedStore, setSelectedStore] = useState(null);
  const [contents, setContents] = useState([]);
  const [contentsLoading, setContentsLoading] = useState(false);

  // AI 옵션 폼
  const {
    values: aiOptions,
    handleChange: handleAiOptionsChange,
    setFieldValue: setAiOptionsField
  } = useForm({
    keywords: [],
    snsType: "",
    industry: "",
    location: ""
  });

  // 게시 옵션 폼
  const {
    values: publishOptions,
    handleChange: handlePublishOptionsChange,
    setFieldValue: setPublishOptionsField
  } = useForm({
    snsType: "",
    isNow: true,
    publishAt: ""
  });

  // useSearch 훅 사용
  const {
    searchTerm,
    filteredData: filteredPosts,
    updateSearchTerm,
    updateFilter
  } = useSearch(posts, ['title'], { debounceDelay: 300 });

  const {
    searchTerm: contentsSearch,
    filteredData: filteredContents,
    updateSearchTerm: updateContentsSearch
  } = useSearch(contents, ['title'], { debounceDelay: 300 });

  // 계정 연동 상태 확인을 위한 state 추가
  const [snsAccountStatus, setSnsAccountStatus] = useState({});
  const [checkingAccountStatus, setCheckingAccountStatus] = useState(false);

  const navigate = useNavigate();

  // useApi 훅 사용
  const { loading, error, execute: fetchPostsApi } = useApi(snsApi.post.getPosts);
  const { execute: deletePostApi } = useApi(snsApi.post.deletePost);
  const { execute: getStoreApi } = useApi(storeApi.getStore);
  const { execute: getContentsApi } = useApi(contentApi.getContents);

  // 새로운 훅들 사용
  const { confirm } = useConfirm();
  const { success, error: showError } = useNotification();

  // 계정 연동 상태 확인 함수
  const checkSnsAccountStatus = async (snsType) => {
    try {
      setCheckingAccountStatus(true);
      const response = await snsApi.account.getAccountInfo(snsType);
      return response.data.result !== null; // 계정 정보가 있으면 연동됨
    } catch (error) {
      console.error(`${snsType} 계정 연동 상태 확인 실패:`, error);
      return false; // 에러 발생 시 연동 안됨으로 처리
    } finally {
      setCheckingAccountStatus(false);
    }
  };

  // 계정 연동 페이지로 이동 함수
  const handleSnsIntegration = () => {
    navigate(ROUTES.SNS_INTEGRATION.route);
  };

  /** ----------------------
   * 데이터 로딩
   ----------------------- */
  useEffect(() => {
    if (activeTab === "list") fetchPosts();
  }, [sortBy, selectedSnsType, activeTab]); // selectedSnsType 배열 변경 시에도 다시 로드

  useEffect(() => {
    if (selectedStoreId && !selectedStore) {
      fetchSelectedStore();
    }
  }, [selectedStoreId]);

  // 매장 상세 조회
  const fetchSelectedStore = async () => {
    try {
      const getStoreResponse = await storeApi.getStore(selectedStoreId);
      const getStoreResponseData = getStoreResponse.data.result;
      // "result": {
      //   "id": 0,
      //   "userId": 0,
      //   "name": "string",
      //   "address": "string",
      //   "phoneNumber": "string",
      //   "businessNumber": "string",
      //   "latitude": 0.1,
      //   "longitude": 0.1,
      //   "industry": "음식점"
      // },
      setSelectedStore(getStoreResponseData);
    } catch (error) {
      console.error("매장 정보 로딩 실패:", error);
    }
  };

  const fetchPosts = async () => {
    if (!selectedStoreId) {
      setPosts([]);
      return;
    }

    try {
      const getPostsResponse = await fetchPostsApi();
      const getPostsResponseData = getPostsResponse.data.result || [];

      let filteredPosts = getPostsResponseData;
      if (selectedSnsType.length > 0) {
        filteredPosts = getPostsResponseData.filter(
          (post) => selectedSnsType.includes(post.snsType) // 배열에 포함되는지 체크
        );
      }
      setPosts(filteredPosts);
    } catch (error) {
      console.error("게시물 목록 로딩 실패:", error);
      setPosts([]);
    }
  };

  /** ----------------------
   * 게시물 관련 함수
   ----------------------- */
  const handleCardClick = (post) => setSelectedPost(post);
  const handleCloseDetail = () => setSelectedPost(null);

  const handleDeletePost = async (postId) => {
    const confirmed = await confirm({
      title: "게시물 삭제",
      message: "정말로 이 게시물을 삭제하시겠습니까?"
    });

    if (confirmed) {
      try {
        // posts 배열에서 해당 post의 snsType 찾기
        const postToDelete = posts.find((p) => p.id === postId);
        await deletePostApi(postId, {
          snsType: postToDelete?.snsType,
        });

        setPosts((prev) => prev.filter((p) => p.id !== postId));
        if (selectedPost?.id === postId) handleCloseDetail();

        success("게시물이 삭제되었습니다.");
      } catch (error) {
        console.error("게시물 삭제 실패:", error);
        showError("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // useSearch 훅이 자동으로 필터링을 처리하므로 추가 로직 불필요
  };

  /** ----------------------
   * AI 콘텐츠 생성
   ----------------------- */
  const generatePost = async (type) => {
    try {
      setIsGenerating(true);

      if (!selectedThumbnail) {
        alert("대표 이미지를 선택해주세요.");
        return;
      }
      if (!selectedStoreId) {
        alert("매장을 선택해주세요.");
        return;
      }

      const selectedContent = uploadedContents.find(
        (c) => c.id === selectedThumbnail
      );

      // 사용자 입력 우선, 없으면 매장 정보 사용
      const inputIndustry =
        aiOptions.industry.trim() ||
        (selectedStore?.industry
          ? Store.getIndustryLabel(selectedStore.industry)
          : "");
      const inputLocation = aiOptions.location.trim() || selectedStore.address;
      const inputKeywords = aiOptions.keywords;

      if (type === "full") {
        const AiPostRequestData = {
          originalName: selectedContent.originalName,
          objectKey: selectedContent.objectKey,
          keywords: inputKeywords,
          snsType: aiOptions.snsType,
          industry: inputIndustry,
          location: inputLocation,
        };
        // console.log("@@ AiPostRequestData", AiPostRequestData);
        const AiPostResponse = await snsApi.ai.uploadAiPost(AiPostRequestData);
        const AiPostResponseData = AiPostResponse.data.result;

        setPostField('title', AiPostResponseData.title || "AI가 생성한 제목");
        setPostField('description', AiPostResponseData.description || "AI가 생성한 본문");
        setPostField('tags', AiPostResponseData.tags || []);
        setGeneratedPost({ title: true, description: true, tags: true });
      } else if (type === "hashtags") {
        if (!post.title.trim() && !post.description.trim()) {
          alert("제목 또는 본문을 입력해주세요.");
          return;
        }

        // AI 플랫폼이 선택되지 않은 경우 체크
        if (!aiOptions.snsType) {
          alert("AI 생성을 위한 대상 플랫폼을 선택해주세요.");
          return;
        }

        const AiTagRequestData = {
          title: post.title,
          description: post.description,
          keywords: inputKeywords,
          snsType: aiOptions.snsType,
          industry: inputIndustry,
          location: inputLocation,
        };

        const AiTagResponse = await snsApi.ai.uploadAiTag(AiTagRequestData);
        const AiTagResponseData = AiTagResponse.data.result;

        setPostField('tags', AiTagResponseData.tags?.map((tag) => {
          // AI에서 온 태그는 #을 제거하고 저장 (일관성 위해)
          return tag.replace("#", "").trim();
        }) || []);
        setGeneratedPost((prev) => ({ ...prev, tags: true }));
      }
    } catch (error) {
      console.error("AI 콘텐츠 생성 실패:", error);
      alert("AI 콘텐츠 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  /** ----------------------
   * 해시태그 관련
   ----------------------- */
  const addTag = (tag) => {
    if (tag && !post.tags.includes(tag)) {
      setPostField('tags', [...post.tags, tag]);
    }
  };

  const removeTag = (index) => {
    setPostField('tags', post.tags.filter((_, i) => i !== index));
  };

  /** ----------------------
   * AI 키워드 관련 함수
   ----------------------- */
  const addKeyword = (keyword) => {
    if (keyword && !aiOptions.keywords.includes(keyword)) {
      setAiOptionsField('keywords', [...aiOptions.keywords, keyword]);
    }
  };

  const removeKeyword = (index) => {
    setAiOptionsField('keywords', aiOptions.keywords.filter((_, i) => i !== index));
  };

  // AI 플랫폼 선택 시 게시 옵션에도 반영
  const handleAiSnsTypeChange = (snsType) => {
    setAiOptionsField('snsType', snsType);

    // 게시 옵션에 해당 플랫폼 선택
    setPublishOptionsField('snsType', publishOptions.snsType === snsType ? publishOptions.snsType : snsType);
  };

  // 컴포넌트 마운트 시 AI 플랫폼을 게시 옵션에 초기 설정
  useEffect(() => {
    if (aiOptions.snsType && !publishOptions.snsType) {
      setPublishOptionsField('snsType', aiOptions.snsType);
    }
  }, [aiOptions.snsType, publishOptions.snsType]);

  /** ----------------------
   * 콘텐츠 라이브러리
   ----------------------- */
  const fetchContents = async () => {
    try {
      setContentsLoading(true);
      const getContentsResponse = await contentApi.getContents();
      const getContentsResponseData = getContentsResponse.data?.result || [];
      //   "result": [
      //   {
      //     "id": 0,
      //     "url": "string",
      //     "title": "string",
      //     "originalName": "string",
      //     "objectKey": "string",
      //     "contentType": "string",
      //     "createdAt": "2025-08-21T18:16:41.442Z",
      //     "updatedAt": "2025-08-21T18:16:41.442Z"
      //   }
      // ]
      // console.log("@@ getContentsResponseData", getContentsResponseData[0]);
      setContents(getContentsResponseData);
    } catch (error) {
      console.error("콘텐츠 라이브러리 로딩 실패:", error);
      setContents([]);
    } finally {
      setContentsLoading(false);
    }
  };

  /** ----------------------
   * 유틸리티 함수
   ----------------------- */
  // 콘텐츠 타입 판별 함수
  const getContentType = (content) => {
    const title = content.title?.toLowerCase() || "";
    const isVideoByExtension =
      title.includes(".mp4") ||
      title.includes(".mov") ||
      title.includes(".avi") ||
      title.includes(".webm");
    const isImageByExtension =
      title.includes(".jpg") ||
      title.includes(".jpeg") ||
      title.includes(".png") ||
      title.includes(".gif") ||
      title.includes(".webp");

    if (content.contentType.startsWith("image/") || isImageByExtension) {
      return "image";
    } else if (
      content.contentType.startsWith("video/") ||
      content.contentType === "binary/octet-stream" ||
      isVideoByExtension
    ) {
      return "video";
    }
    return "unknown";
  };

  const getFilteredContents = () => {
    let filtered = filteredContents;
    if (contentsFilter !== "all") {
      filtered = filtered.filter((item) => item.contentType === contentsFilter);
    }
    return filtered;
  };

  const handleSelectFromContents = (selectedContents) => {
    const newContents = selectedContents.map((content) => ({
      id: content.id,
      url: content.url,
      title: content.title,
      contentType: content.contentType,
      originalName: content.originalName, // originalName 추가
      objectKey: content.objectKey, // objectKey 추가
      fromLibrary: true,
    }));

    setUploadedContents((prev) => [...prev, ...newContents]);
    if (!selectedThumbnail && newContents.length > 0) {
      setSelectedThumbnail(newContents[0].id);
    }
    setShowContents(false);
  };

  /** ----------------------
   * 플랫폼 필터 컴포넌트
   ----------------------- */
  const SnsTypeFilter = ({ selectedSnsTypes, onSnsTypeChange }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-bold text-gray-700 flex items-center">
          플랫폼 필터:
        </span>
        {SNS_TYPES.map((snsType) => (
          <button
            key={snsType.id}
            onClick={() => {
              if (selectedSnsTypes.includes(snsType.id)) {
                onSnsTypeChange(
                  selectedSnsTypes.filter((p) => p !== snsType.id)
                );
              } else {
                onSnsTypeChange([...selectedSnsTypes, snsType.id]);
              }
            }}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
              selectedSnsTypes.includes(snsType.id)
                ? `${snsType.color} border-transparent`
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <img
              src={snsType.icon}
              alt={snsType.name}
              className="w-5 h-5 mr-2"
            />
            {snsType.name}
          </button>
        ))}
        {/* 전체 선택/해제 버튼 추가 */}
        {selectedSnsTypes.length > 0 && (
          <button
            onClick={() => onSnsTypeChange([])}
            className="flex items-center px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            ✕ 전체 해제
          </button>
        )}
      </div>
    </div>
  );

  /** ----------------------
   * 게시물 목록 렌더링
   ----------------------- */
  const renderPostList = () => {
    if (error) {
      return <ErrorPage title="게시물 목록 로딩 실패" message={error} />;
    }
    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <div className="flex-1 w-full relative">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">게시물 관리</h1>
          <button
            onClick={() => setActiveTab("upload")}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />새 게시물 업로드
          </button>
        </div>

        {/* 플랫폼 필터 */}
        <SnsTypeFilter
          selectedSnsTypes={selectedSnsType}
          onSnsTypeChange={setSelectedSnsType}
        />

        {/* 검색 필터 */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={updateSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSearch={handleSearch}
        />

        {/* 게시물 목록 */}
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={Video}
            title="게시물이 없습니다"
            description="업로드된 게시물이 여기에 표시됩니다."
            actionText="새 게시물 업로드"
            onAction={() => setActiveTab("upload")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostManagementCard
                key={post.id}
                content={post}
                onClick={() => handleCardClick(post)}
                onDelete={() => handleDeletePost(post.id)}
              />
            ))}
          </div>
        )}

        {/* 게시물 상세보기 */}
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={handleCloseDetail}
            handleDelete={handleDeletePost}
          />
        )}
      </div>
    );
  };
  /** ----------------------
   * 게시물 업로드
   ----------------------- */
  const handleUpload = async () => {
    try {
      // console.log("@@ post.title", post.title);
      // console.log("@@ post.description", post.description);
      // console.log("@@ post.tags", post.tags);
      if (!post.title || !post.description || publishOptions.snsType === "") {
        alert("필수 정보를 모두 입력해주세요.");
        return;
      }

      const selectedContent = uploadedContents.find(
        (c) => c.id === selectedThumbnail
      );

      // 계정 연동 상태 확인
      const isConnected = await checkSnsAccountStatus(publishOptions.snsType);
      if (!isConnected) {
        if (
          window.confirm(
            `${publishOptions.snsType.toUpperCase()} 계정 연동이 필요합니다.\n계정 연동 페이지로 이동하시겠습니까?`
          )
        ) {
          handleSnsIntegration();
        }
        return;
      }

      // 현재는 YouTube만 지원
      if (publishOptions.snsType === "youtube") {
        // 해시태그를 #과 함께 문자열로 변환
        // const hashtagsText =
        //   post.tags.length > 0 ? "\n\n" + post.tags.join(" ") : "";

        // 예약 발행 시간 처리
        const getPublishAt = () => {
          if (publishOptions.isNow === false) {
            if (publishOptions.publishAt) {
              const dateTime = new Date(publishOptions.publishAt).toISOString();
              return dateTime;
            }
            // 기본값: 1시간 후
            const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
            return oneHourLater.toISOString();
          }
          // 즉시 발행인 경우 현재 시각
          return new Date().toISOString();
        };
        console.log("@@ uploadData 전", post.tags);
        const uploadData = {
          snsType: publishOptions.snsType,
          originalName: selectedContent.originalName,
          objectKey: selectedContent.objectKey,
          title: post.title,
          description: post.description,
          tags: post.tags,
          isNow: publishOptions.isNow,
          publishAt: getPublishAt(),
        };
        console.log("@@ uploadData 후", uploadData);
        await snsApi.post.uploadPost(uploadData);
        alert("게시물이 업로드되었습니다!");
      }

      setActiveTab("list");

      // 초기화
      setUploadedContents([]);
      setSelectedThumbnail(null);
      resetPostForm();
      setPublishOptionsField('snsType', '');
      setPublishOptionsField('isNow', true);
      setPublishOptionsField('publishAt', '');
      setGeneratedPost({ title: false, description: false, tags: false });

      fetchPosts();
    } catch (error) {
      console.error("게시물 업로드 실패:", error);
      console.error("에러 상세:", error.response?.data);

      // 계정 연동 관련 에러인지 확인
      if (
        error.response?.data?.message?.includes("토큰") ||
        error.response?.data?.message?.includes("연동") ||
        error.response?.status === 401
      ) {
        if (
          window.confirm(
            "계정 연동에 문제가 있습니다.\n계정 연동 페이지로 이동하시겠습니까?"
          )
        ) {
          handleSnsIntegration();
        }
      } else {
        alert("게시물 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  /** ----------------------
   * 업로드 폼 렌더링
   ----------------------- */
  const renderUploadForm = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setActiveTab("list")}
        className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
      >
        <span>← 게시물 목록으로 돌아가기</span>
      </button>

      <h2 className="text-2xl font-bold text-gray-900">새 게시물 업로드</h2>

      {/* 1. 콘텐츠 업로드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1. 콘텐츠 업로드
        </h3>

        <div className="space-y-6">
          {/* 콘텐츠 라이브러리 버튼 */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowContents(true);
                fetchContents();
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FolderOpen size={20} />
              <span>콘텐츠 라이브러리에서 가져오기</span>
            </button>
            <p className="text-xs text-gray-400 text-center">
              기존에 업로드한 콘텐츠를 재사용할 수 있습니다
            </p>
          </div>
        </div>

        {/* 업로드된 콘텐츠 */}
        {uploadedContents.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">업로드된 콘텐츠</h4>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {uploadedContents.length}개
                </span>
              </div>
              <button
                onClick={() => {
                  setUploadedContents([]);
                  setSelectedThumbnail(null);
                }}
                className="text-gray-400 hover:text-red-500 text-sm flex items-center space-x-1 transition-colors"
              >
                <X size={16} />
                <span>전체 삭제</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4">
                {uploadedContents.map((content) => (
                  <div
                    key={content.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                      selectedThumbnail === content.id
                        ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedThumbnail(content.id)}
                  >
                    {getContentType(content) === "image" ? (
                      <img
                        src={content.url}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[10px] border-l-gray-700 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 대표 이미지 배지 */}
                    {selectedThumbnail === content.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                        ✓ 대표
                      </div>
                    )}

                    {/* 파일명 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">
                        {content.title}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedContents((prev) =>
                          prev.filter((c) => c.id !== content.id)
                        );
                        if (selectedThumbnail === content.id) {
                          const remaining = uploadedContents.filter(
                            (c) => c.id !== content.id
                          );
                          setSelectedThumbnail(
                            remaining.length > 0 ? remaining[0].id : null
                          );
                        }
                      }}
                      className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* 안내 */}
              <div className="space-y-2 text-sm mt-4">
                <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                  <span className="text-blue-600 text-xs">💡</span>
                  <span>
                    대표 이미지를 선택하세요. 미리보기와 썸네일로 사용됩니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 게시물 작성 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          2. 게시물 작성
        </h3>

        {/* AI 생성 섹션 */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              AI로 자동 생성하기
            </h4>
          </div>

          {/* AI 생성 옵션 */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-700">
              AI 생성 옵션
            </h5>

            {/* 플랫폼 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대상 플랫폼
              </label>
              <div className="grid grid-cols-3 gap-4">
                {SNS_TYPES.map((snsType) => (
                  <label
                    key={snsType.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="aiSnsType"
                      value={snsType.id}
                      checked={aiOptions.snsType === snsType.id}
                      onChange={(e) => handleAiSnsTypeChange(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`px-3 py-2 ${snsType.color} rounded-lg flex-1 text-center flex items-center justify-center`}
                    >
                      <img
                        src={snsType.icon}
                        alt={snsType.name}
                        className="w-4 h-4 mr-2"
                      />
                      {snsType.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI 생성 시 최적화할 플랫폼을 선택하세요
              </p>
            </div>

            {/* 키워드 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                키워드 (선택사항)
              </label>

              {/* 키워드 목록 */}
              {aiOptions.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1 p-3 rounded-lg">
                  {aiOptions.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-black px-3 py-1 rounded-full flex items-center space-x-2 text-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => removeKeyword(index)}
                        className="hover:bg-gray-300 rounded-full p-1 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* 키워드 입력창 */}
              <input
                type="text"
                placeholder="AI 생성 시 참고할 키워드를 입력하세요 (Enter로 추가)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value.trim();
                    if (value) {
                      addKeyword(value);
                      e.target.value = "";
                    }
                  }
                }}
              />
            </div>

            {/* businessType과 location을 한 행에 두 열로 배치 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 업종/비즈니스 타입 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업종
                </label>
                <select
                  value={aiOptions.industry}
                  onChange={(e) =>
                    setAiOptions((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    !aiOptions.industry ? "text-gray-500" : "text-gray-900"
                  }`}
                  style={{
                    color: !aiOptions.industry ? "#6B7280" : "#111827",
                  }}
                >
                  <option value="" disabled>
                    {selectedStore?.industry
                      ? `${Store.getIndustryLabel(selectedStore.industry)}`
                      : "선택"}
                  </option>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <option
                      key={industry.value}
                      value={industry.label}
                      style={{ color: "#111827" }}
                    >
                      {industry.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 위치 정보 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치 정보 (선택사항)
                </label>
                <input
                  type="text"
                  value={aiOptions.location}
                  onChange={(e) =>
                    setAiOptions((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder={selectedStore?.address || "예: 서울시 강남구"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              * 키워드와 업종을 입력하시면 더 최적화된 게시물을 생성할 수
              있습니다
            </p>
          </div>

          {/* 기존 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => generatePost("full")}
              disabled={isGenerating || !selectedThumbnail}
              className="bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <Sparkles size={14} />
              <span>
                {isGenerating ? "생성 중..." : "제목 + 본문 + 해시태그 생성"}
              </span>
            </button>

            <button
              onClick={() => generatePost("hashtags")}
              disabled={
                isGenerating ||
                !selectedThumbnail ||
                (!post.title.trim() && !post.description.trim())
              }
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <Hash size={14} />
              <span>{isGenerating ? "생성 중..." : "해시태그 생성"}</span>
              {!post.title.trim() &&
                !post.description.trim() &&
                selectedThumbnail && (
                  <span className="text-xs opacity-75">(제목/본문 필요)</span>
                )}
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="space-y-2 text-sm">
            {!selectedThumbnail ? (
              <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>대표 이미지를 선택하시면 AI 생성이 가능합니다</span>
              </div>
            ) : (
              <div className="space-y-1">
                {!post.title.trim() &&
                  !post.description.trim() &&
                  post.tags.length === 0 && (
                    <div className="flex items-center space-x-2 text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>
                        제목, 본문, 해시태그를 한번에 모두 생성할 수 있습니다
                      </span>
                    </div>
                  )}
                {post.title.trim() &&
                  post.description.trim() &&
                  post.tags.length === 0 && (
                    <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        작성하신 제목/본문에 어울리는 해시태그를 생성할 수
                        있습니다
                      </span>
                    </div>
                  )}
                {post.title.trim() &&
                  !post.description.trim() &&
                  post.tags.length === 0 && (
                    <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        본문도 작성하시면 해시태그를 생성할 수 있습니다
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              제목
            </label>
            {generatedPost.title && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={(e) => {
              handlePostChange(e);
              setGeneratedPost((prev) => ({ ...prev, title: false }));
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-sm"
            placeholder="직접 입력하거나 AI로 생성해보세요"
          />
        </div>

        {/* 본문 입력 */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              본문
            </label>
            {generatedPost.description && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>
          <textarea
            name="description"
            value={post.description}
            onChange={(e) => {
              handlePostChange(e);
              setGeneratedPost((prev) => ({ ...prev, description: false }));
            }}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-sm"
            placeholder="직접 입력하거나 AI로 생성해보세요"
          />
        </div>

        {/* 해시태그 입력 */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              해시태그
            </label>
            {generatedPost.tags && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>

          {/* 해시태그 목록 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1 p-3 rounded-lg">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center space-x-2 text-sm"
                >
                  <span>#{tag}</span> {/* 항상 #를 붙여서 표시 */}
                  <button
                    onClick={() => {
                      removeTag(index);
                      if (post.tags.length === 1) {
                        setGeneratedPost((prev) => ({
                          ...prev,
                          tags: false,
                        }));
                      }
                    }}
                    className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 해시태그 입력창 */}
          <div className="relative">
            <input
              type="text"
              placeholder="직접 입력하거나 AI로 생성해보세요 (Enter로 추가)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const value = e.target.value.replace("#", "").trim();
                  if (value) {
                    addTag(value);
                    e.target.value = "";
                    setGeneratedPost((prev) => ({
                      ...prev,
                      tags: false,
                    }));
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* 3. 게시 옵션 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          3. 게시 옵션
        </h3>

        <div className="space-y-4">
          {/* 플랫폼 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              게시할 플랫폼
            </label>
            <div className="grid grid-cols-3 gap-4">
              {SNS_TYPES.map((snsType) => (
                <label
                  key={snsType.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={publishOptions.snsType === snsType.id}
                    onChange={async (e) => {
                      if (e.target.checked) {
                        setPublishOptions((prev) => ({
                          ...prev,
                          snsType: snsType.id,
                        }));

                        // 선택 시 계정 연동 상태 확인
                        const isConnected = await checkSnsAccountStatus(
                          snsType.id
                        );
                        setSnsAccountStatus((prev) => ({
                          ...prev,
                          [snsType.id]: isConnected,
                        }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span
                    className={`px-3 py-2 ${snsType.color} rounded-lg flex-1 text-center flex items-center justify-center`}
                  >
                    <img
                      src={snsType.icon}
                      alt={snsType.name}
                      className="w-4 h-4 mr-2"
                    />
                    {snsType.name}
                    {/* AI 대상 플랫폼 표시 */}
                    {snsType.id === aiOptions.snsType && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        AI 최적화
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {/* 선택된 플랫폼의 계정 연동 상태를 별도 영역에 표시 */}
            {publishOptions.snsType && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {
                        SNS_TYPES.find((s) => s.id === publishOptions.snsType)
                          ?.name
                      }{" "}
                      연동 상태:
                    </span>
                    <span
                      className={`text-sm font-bold flex items-center space-x-1 ${
                        snsAccountStatus[publishOptions.snsType] === true
                          ? "text-emerald-600"
                          : snsAccountStatus[publishOptions.snsType] === false
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      <span>
                        {snsAccountStatus[publishOptions.snsType] === true
                          ? "✓ 연동됨"
                          : snsAccountStatus[publishOptions.snsType] === false
                          ? "⚠️ 연동 필요"
                          : "⏳ 확인중"}
                      </span>
                    </span>
                  </div>

                  {/* 연동 버튼 */}
                  {snsAccountStatus[publishOptions.snsType] === false && (
                    <button
                      onClick={handleSnsIntegration}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      연동하기
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 게시 시점 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              게시 시점
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="scheduleType"
                  value="immediate"
                  checked={publishOptions.isNow === true}
                  onChange={() =>
                    setPublishOptions((prev) => ({
                      ...prev,
                      isNow: true,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>즉시 게시</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="scheduleType"
                  value="scheduled"
                  checked={publishOptions.isNow === false}
                  onChange={() =>
                    setPublishOptions((prev) => ({
                      ...prev,
                      isNow: false,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>예약 게시</span>
              </label>
            </div>

            {/* 예약 옵션 */}
            {publishOptions.isNow === false && (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={publishOptions.publishAt?.split("T")[0] || ""}
                  onChange={(e) => {
                    const date = e.target.value;
                    const time =
                      publishOptions.publishAt?.split("T")[1] || "12:00";
                    setPublishOptions((prev) => ({
                      ...prev,
                      publishAt: `${date}T${time}`,
                    }));
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={publishOptions.publishAt?.split("T")[1] || "12:00"}
                  onChange={(e) => {
                    const time = e.target.value;
                    const date =
                      publishOptions.publishAt?.split("T")[0] ||
                      new Date().toISOString().split("T")[0];
                    setPublishOptions((prev) => ({
                      ...prev,
                      publishAt: `${date}T${time}`,
                    }));
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. 미리보기 및 업로드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            4. 미리보기 및 업로드
          </h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>{showPreview ? "미리보기 숨기기" : "미리보기 펼치기"}</span>
          </button>
        </div>

        {/* 미리보기 */}
        {showPreview && (
          <div className="mb-6 space-y-6">
            {/* 3개 플랫폼 미리보기를 모두 표시 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 유튜브 미리보기 */}
              <div className="relative">
                {/* 게시 예정 배지 */}
                {publishOptions.snsType === "youtube" && (
                  <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    게시예정
                  </div>
                )}
                <div
                  className={`bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all ${
                    publishOptions.snsType === "youtube"
                      ? "border-emerald-500 shadow-emerald-100 ring-2 ring-emerald-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* YouTube 미리보기 상단에 추가 */}
                  <div className="p-3 border-b border-gray-100">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                      YouTube
                    </span>
                  </div>
                  {selectedThumbnail && (
                    <div className="relative aspect-[9/16] bg-black m-2">
                      <img
                        src={
                          uploadedContents.find(
                            (c) => c.id === selectedThumbnail
                          )?.url
                        }
                        alt="YouTube 미리보기"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title || "비디오 제목"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {post.description || "비디오 설명"}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-blue-600 text-sm hover:underline cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 my-4">
                      <span>조회수 2만회</span>
                      <span>2일 전</span>
                      <span>더보기</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">나</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {selectedStore?.name || "your_store"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 인스타그램 미리보기 */}
              <div className="relative">
                {/* 게시 예정 배지 */}
                {publishOptions.snsType === "instagram" && (
                  <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    게시예정
                  </div>
                )}
                <div
                  className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all ${
                    publishOptions.snsType === "instagram"
                      ? "border-emerald-500 shadow-emerald-100 ring-2 ring-emerald-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Instagram 미리보기 상단에 추가 */}
                  <div className="p-3 border-b border-gray-100">
                    <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
                      Instagram
                    </span>
                  </div>
                  <div className="flex items-center p-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">나</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900">
                        {selectedStore?.name || "your_store"}
                      </p>
                      <p className="text-xs text-gray-500">방금 전</p>
                    </div>
                    <button className="text-gray-400">⋯</button>
                  </div>

                  {selectedThumbnail && (
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={
                          uploadedContents.find(
                            (c) => c.id === selectedThumbnail
                          )?.url
                        }
                        alt="instagram 미리보기"
                        className="w-full h-full object-cover"
                      />
                      {uploadedContents.find((c) => c.id === selectedThumbnail)
                        ?.contentType === "video" && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          📹 동영상
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex space-x-4">
                        <button className="text-xl">❤️</button>
                        <button className="text-xl">💬</button>
                        <button className="text-xl">📤</button>
                      </div>
                      <button className="text-xl">🔖</button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">좋아요 22개</p>
                      <div className="text-sm">
                        <span className="font-semibold">your_store</span>
                        <span className="ml-2">
                          {post.title && <strong>{post.title}</strong>}
                          {post.title && post.description && <br />}
                          {post.description}
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="text-sm text-blue-600">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="mr-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 페이스북 미리보기 */}
              <div className="relative">
                {/* 게시 예정 배지 */}
                {publishOptions.snsType === "facebook" && (
                  <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    게시예정
                  </div>
                )}
                <div
                  className={`bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all ${
                    publishOptions.snsType === "facebook"
                      ? "border-emerald-500 shadow-emerald-100 ring-2 ring-emerald-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Facebook 미리보기 상단에도 추가 */}
                  <div className="p-4 border-b border-gray-100">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Facebook
                    </span>
                  </div>
                  <div className="flex items-center p-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">나</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900">
                        {selectedStore?.name || "your_store"}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>방금 전</span>
                        <span className="ml-1">🌍</span>
                      </div>
                    </div>
                    <button className="text-gray-400">⋯</button>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {post.title && (
                        <h3 className="font-semibold text-gray-900">
                          {post.title}
                        </h3>
                      )}
                      {post.description && (
                        <p className="text-gray-800">{post.description}</p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-blue-600 hover:underline cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedThumbnail && (
                      <div className="relative rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={
                            uploadedContents.find(
                              (c) => c.id === selectedThumbnail
                            )?.url
                          }
                          alt="facebook 미리보기"
                          className="w-full h-48 object-cover"
                        />
                        {uploadedContents.find(
                          (c) => c.id === selectedThumbnail
                        )?.contentType === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[16px] border-l-blue-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 px-4 py-2">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span className="text-xs text-gray-500">
                        👍 ❤️ 😊 22명이 좋아합니다
                      </span>
                      <span className="text-xs text-gray-500">댓글 22개</span>
                    </div>
                    <div className="flex border-t border-gray-100 pt-2">
                      <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
                        👍 좋아요
                      </button>
                      <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
                        💬 댓글
                      </button>
                      <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
                        📤 공유
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 미리보기 없을 때 */}
            {publishOptions.snsType === "" && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={24} className="text-gray-400" />
                </div>
                <p>플랫폼을 선택하면 게시 예정 플랫폼이 강조됩니다</p>
              </div>
            )}
          </div>
        )}
        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={
            !post.title ||
            !post.description ||
            publishOptions.snsType === "" ||
            checkingAccountStatus
          }
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {checkingAccountStatus ? "계정 연동 확인 중..." : "업로드하기"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "list" ? renderPostList() : renderUploadForm()}
      </div>

      {/* 콘텐츠 라이브러리 모달 */}
      {showContents && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">콘텐츠 라이브러리</h2>
              <button
                onClick={() => setShowContents(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="콘텐츠 검색..."
                    value={contentsSearch}
                    onChange={(e) => updateContentsSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={contentsFilter}
                  onChange={(e) => setContentsFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="video">동영상</option>
                  <option value="image">이미지</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {contentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredContents().map((content) => (
                    <div
                      key={content.id}
                      className="relative rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all"
                      onClick={() => handleSelectFromContents([content])}
                    >
                      <img
                        src={content.url}
                        alt={content.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {getContentType(content) === "video" ? "📹" : "🖼️"}{" "}
                        {/* {getContentType(content)} */}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                        <p className="text-sm truncate">{content.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!contentsLoading && getFilteredContents().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen size={24} className="text-gray-400" />
                  </div>
                  <p>콘텐츠가 없습니다</p>
                  <p className="text-sm">먼저 콘텐츠를 업로드해주세요</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowContents(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PostManagement };
