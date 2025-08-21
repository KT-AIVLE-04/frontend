import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Hash,
  Sparkles,
  X,
  FolderOpen,
  Search,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { EmptyStateBox, ErrorPage, LoadingSpinner } from "../../components";
import {
  SearchFilter,
  PostManagementCard,
  PostManagementVideoDetail,
} from "./components";
import { useSelector } from "react-redux";
import { storeApi } from "../../api/store";
import { snsApi } from "../../api/sns";
import { Store } from "../../models/Store";
import { PLATFORMS } from "../../const/platforms";
import { INDUSTRY_OPTIONS } from "../../const/industries";

const PostManagement = () => {
  /** ----------------------
   * 상태 관리
   ----------------------- */
  const { selectedStoreId, user } = useSelector((state) => state.auth); // /src/store/index.js, /src/store/authSlice.js 참고하여 이해

  const [activeTab, setActiveTab] = useState("list");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    hashtags: [],
  });

  // AI 생성 옵션 상태 추가
  const [aiOptions, setAiOptions] = useState({
    platform: "youtube",
    keywords: [], // 문자열에서 배열로 변경
    businessType: "", // businessType 추가
    location: "",
  });

  const [publishOptions, setPublishOptions] = useState({
    platforms: [],
    scheduleType: "immediate", // "immediate" | "scheduled"
    scheduledDate: "", // YYYY-MM-DD 형식
    scheduledTime: "", // HH:MM 형식
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [generatedContent, setGeneratedContent] = useState({
    title: false,
    content: false,
    hashtags: false,
  });

  const [showContentLibrary, setShowContentLibrary] = useState(false);
  const [contentLibrarySearch, setContentLibrarySearch] = useState("");
  const [contentLibraryFilter, setContentLibraryFilter] = useState("all");

  const [selectedStore, setSelectedStore] = useState(null);

  /** ----------------------
   * 데이터 로딩
   ----------------------- */
  useEffect(() => {
    if (activeTab === "list") fetchContents();
  }, [sortBy, selectedPlatforms, activeTab]);

  useEffect(() => {
    if (selectedStoreId) fetchSelectedStore();
  }, [selectedStoreId]);

  const fetchSelectedStore = async () => {
    try {
      const response = await storeApi.getStore(selectedStoreId);
      setSelectedStore(response.data?.result);
    } catch (error) {
      console.error("매장 정보 로딩 실패:", error);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);

      // 개발용: selectedStoreId가 없어도 목업 데이터 표시
      if (!selectedStoreId) {
        console.log("⚠️ selectedStoreId가 없음 - 목업 데이터 표시");

        // 목업 데이터 직접 설정
        const mockPosts = [
          {
            postId: "video_001",
            id: "video_001",
            title: "카페 달콤 신메뉴 소개",
            description: "새로운 시그니처 음료와 디저트를 소개합니다!",
            thumbnailUrl: "https://picsum.photos/400/300?random=1",
            viewCount: 2456,
            likeCount: 342,
            commentCount: 87,
            publishedAt: "2024-01-15T10:30:00Z",
            createdAt: "2024-01-15T10:30:00Z",
            status: "completed",
          },
          {
            postId: "video_002",
            id: "video_002",
            title: "매장 분위기 소개",
            description: "아늑하고 편안한 우리 매장의 분위기를 느껴보세요",
            thumbnailUrl: "https://picsum.photos/400/300?random=2",
            viewCount: 1845,
            likeCount: 256,
            commentCount: 62,
            publishedAt: "2024-01-14T15:20:00Z",
            createdAt: "2024-01-14T15:20:00Z",
            status: "completed",
          },
          {
            postId: "video_003",
            id: "video_003",
            title: "특별 할인 이벤트",
            description: "이번 주 한정 특가 이벤트를 놓치지 마세요!",
            thumbnailUrl: "https://picsum.photos/400/300?random=3",
            viewCount: 3124,
            likeCount: 423,
            commentCount: 95,
            publishedAt: "2024-01-13T09:00:00Z",
            createdAt: "2024-01-13T09:00:00Z",
            status: "completed",
          },
        ];

        const transformedPosts = mockPosts.map((post) => ({
          id: post.postId || post.id,
          type: "video",
          title: post.title,
          thumbnailUrl:
            post.thumbnailUrl || "https://via.placeholder.com/300x200",
          author: user?.name || "사용자",
          views: post.viewCount || 0,
          likes: post.likeCount || 0,
          comments: post.commentCount || 0,
          createdAt: post.publishedAt || post.createdAt,
          platforms: ["youtube"],
          status: post.status || "completed",
          description: post.description,
        }));

        setPosts(transformedPosts);
        return;
      }

      const response = await snsApi.account.getPostList(
        "youtube",
        selectedStoreId
      );

      // 단순화된 응답 처리
      const postsData = response.data || [];

      const transformedPosts = postsData.map((post) => ({
        id: post.postId || post.id,
        type: "video",
        title: post.title,
        thumbnailUrl:
          post.thumbnailUrl || "https://via.placeholder.com/300x200",
        author: user?.name || "사용자",
        views: post.viewCount || 0,
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        createdAt: post.publishedAt || post.createdAt,
        platforms: ["youtube"],
        status: post.status || "completed",
        description: post.description,
      }));

      let filteredContents = transformedPosts;
      if (selectedPlatforms.length > 0) {
        filteredContents = transformedPosts.filter((content) =>
          content.platforms.some((platform) =>
            selectedPlatforms.includes(platform)
          )
        );
      }

      setPosts(filteredContents);
    } catch (error) {
      console.error("게시물 목록 로딩 실패:", error);
      setError("게시물 목록을 불러오는데 실패했습니다.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  /** ----------------------
   * 게시물 관련 함수
   ----------------------- */
  const handleCardClick = (post) => setSelectedPost(post);
  const handleCloseDetail = () => setSelectedPost(null);

  const handleDelete = async (contentId) => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await snsApi.post.deleteVideo("youtube", {
          postId: contentId,
          storeId: selectedStoreId,
        });

        setPosts((prev) => prev.filter((p) => p.id !== contentId));
        if (selectedPost?.id === contentId) handleCloseDetail();

        alert("게시물이 삭제되었습니다.");
      } catch (error) {
        console.error("게시물 삭제 실패:", error);
        alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter((content) =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((content) =>
        content.platforms.some((platform) =>
          selectedPlatforms.includes(platform)
        )
      );
    }

    setPosts(filtered);
  };

  /** ----------------------
   * AI 콘텐츠 생성
   ----------------------- */
  const generateContent = async (type = "full") => {
    try {
      setIsGenerating(true);

      if (!selectedThumbnail) {
        alert("대표 이미지를 선택해주세요.");
        return;
      }
      if (!selectedStore) {
        alert("매장 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const selectedFile = uploadedFiles.find(
        (f) => f.id === selectedThumbnail
      );

      // 사용자 입력 우선, 없으면 매장 정보 사용
      const businessType =
        aiOptions.businessType.trim() ||
        (selectedStore?.industry
          ? Store.getIndustryLabel(selectedStore.industry)
          : "") ||
        "일반";
      const location = aiOptions.location.trim() || selectedStore.address || "";

      // 키워드 배열 그대로 사용
      const userKeywords = aiOptions.keywords;

      if (type === "full") {
        const requestData = {
          content_data: selectedFile?.url || "",
          user_keywords: userKeywords,
          sns_platform: aiOptions.platform,
          business_type: businessType,
          location: location,
        };

        const response = await snsApi.ai.createPost(requestData);
        const result = response.data;

        setPostData({
          title: result.title || "AI가 생성한 제목",
          content: result.content || "AI가 생성한 본문",
          hashtags: result.hashtags?.map((tag) => tag.replace("#", "")) || [],
        });
        setGeneratedContent({ title: true, content: true, hashtags: true });
      } else if (type === "hashtags") {
        if (!postData.title.trim() && !postData.content.trim()) {
          alert("제목 또는 본문을 입력해주세요.");
          return;
        }

        const requestData = {
          post_title: postData.title,
          post_content: postData.content,
          user_keywords: userKeywords,
          sns_platform: aiOptions.platform,
          business_type: businessType,
          location: location,
        };

        const response = await snsApi.ai.createHashtags(requestData);
        const result = response.data;

        setPostData((prev) => ({
          ...prev,
          hashtags: result.hashtags?.map((tag) => tag.replace("#", "")) || [],
        }));
        setGeneratedContent((prev) => ({ ...prev, hashtags: true }));
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
  const addHashtag = (hashtag) => {
    if (hashtag && !postData.hashtags.includes(hashtag)) {
      setPostData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag],
      }));
    }
  };

  const removeHashtag = (index) => {
    setPostData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((_, i) => i !== index),
    }));
  };

  /** ----------------------
   * AI 키워드 관련 함수
   ----------------------- */
  const addKeyword = (keyword) => {
    if (keyword && !aiOptions.keywords.includes(keyword)) {
      setAiOptions((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
      }));
    }
  };

  const removeKeyword = (index) => {
    setAiOptions((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  // AI 플랫폼 선택 시 게시 옵션에도 반영
  const handleAiPlatformChange = (platform) => {
    setAiOptions((prev) => ({
      ...prev,
      platform: platform,
    }));

    // 게시 옵션에도 해당 플랫폼 추가 (중복 방지)
    setPublishOptions((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms
        : [...prev.platforms, platform],
    }));
  };

  // 컴포넌트 마운트 시 AI 플랫폼을 게시 옵션에 초기 설정
  useEffect(() => {
    if (
      aiOptions.platform &&
      !publishOptions.platforms.includes(aiOptions.platform)
    ) {
      setPublishOptions((prev) => ({
        ...prev,
        platforms: [...prev.platforms, aiOptions.platform],
      }));
    }
  }, [aiOptions.platform]);

  /** ----------------------
   * 콘텐츠 라이브러리
   ----------------------- */
  const getFilteredContentLibrary = () => {
    let filtered = posts;
    if (contentLibraryFilter !== "all") {
      filtered = filtered.filter((item) => item.type === contentLibraryFilter);
    }
    if (contentLibrarySearch) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(contentLibrarySearch.toLowerCase())
      );
    }
    return filtered;
  };

  const handleSelectFromLibrary = (selectedItems) => {
    const newFiles = selectedItems.map((item) => ({
      id: item.id,
      file: null,
      url: item.thumbnailUrl,
      type: item.type,
      name: item.title,
      fromLibrary: true,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (!selectedThumbnail && newFiles.length > 0) {
      setSelectedThumbnail(newFiles[0].id);
    }
    setShowContentLibrary(false);
  };

  /** ----------------------
   * 플랫폼 필터 컴포넌트
   ----------------------- */
  const PlatformFilter = ({ selectedPlatforms, onPlatformChange }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-bold text-gray-700 flex items-center">
          플랫폼 필터:
        </span>
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => {
              if (selectedPlatforms.includes(platform.id)) {
                onPlatformChange(
                  selectedPlatforms.filter((p) => p !== platform.id)
                );
              } else {
                onPlatformChange([...selectedPlatforms, platform.id]);
              }
            }}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
              selectedPlatforms.includes(platform.id)
                ? `${platform.color} border-transparent`
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <img
              src={platform.icon}
              alt={platform.name}
              className="w-5 h-5 mr-2"
            />
            {platform.name}
          </button>
        ))}
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
        <PlatformFilter
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={setSelectedPlatforms}
        />

        {/* 검색 필터 */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSearch={handleSearch}
        />

        {/* 게시물 목록 */}
        {posts.length === 0 ? (
          <EmptyStateBox
            icon={Video}
            title="게시물이 없습니다"
            description="업로드된 게시물이 여기에 표시됩니다."
            actionText="새 게시물 업로드"
            onAction={() => setActiveTab("upload")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostManagementCard
                key={post.id}
                content={post}
                onClick={() => handleCardClick(post)}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>
        )}

        {/* 게시물 상세보기 */}
        {selectedPost && (
          <PostManagementVideoDetail
            video={selectedPost}
            onClose={handleCloseDetail}
            handleDelete={handleDelete}
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
      if (
        !postData.title ||
        !postData.content ||
        publishOptions.platforms.length === 0
      ) {
        alert("필수 정보를 모두 입력해주세요.");
        return;
      }
      if (!selectedThumbnail) {
        alert("대표 이미지를 선택해주세요.");
        return;
      }

      const selectedFile = uploadedFiles.find(
        (f) => f.id === selectedThumbnail
      );

      // 현재는 YouTube만 지원
      if (publishOptions.platforms.includes("youtube")) {
        // 해시태그를 #과 함께 문자열로 변환
        const hashtagsText =
          postData.hashtags.length > 0
            ? "\n\n" + postData.hashtags.map((tag) => `#${tag}`).join(" ")
            : "";

        // 예약 발행 시간 처리
        const getPublishAt = () => {
          if (publishOptions.scheduleType === "scheduled") {
            if (publishOptions.scheduledDate && publishOptions.scheduledTime) {
              // 사용자가 설정한 날짜와 시간을 ISO 형식으로 변환
              const dateTime = `${publishOptions.scheduledDate}T${publishOptions.scheduledTime}:00Z`;
              return dateTime;
            }
            // 기본값: 1시간 후
            const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
            return oneHourLater.toISOString();
          }
          return undefined; // 즉시 발행인 경우 publishAt 없음
        };

        const uploadData = {
          storeId: selectedStoreId,
          title: postData.title,
          description: postData.content + hashtagsText, // 본문 + 해시태그 조합
          contentPath: selectedFile?.url || "",
          tags: postData.hashtags, // String[] 형태로 전송
          detail: {
            categoryId: "22", // YouTube 카테고리 ID (22: People & Blogs)
            notifySubscribers: true,
            ...(publishOptions.scheduleType === "scheduled" && {
              publishAt: getPublishAt(),
            }),
          },
        };

        console.log("업로드 데이터:", uploadData); // 디버깅용

        await snsApi.post.uploadVideo("youtube", uploadData);
        alert("게시물이 업로드되었습니다!");
      }

      setActiveTab("list");

      // 초기화
      setUploadedFiles([]);
      setSelectedThumbnail(null);
      setPostData({ title: "", content: "", hashtags: [] });
      setPublishOptions({ platforms: [], scheduleType: "immediate" });
      setGeneratedContent({ title: false, content: false, hashtags: false });

      fetchContents();
    } catch (error) {
      console.error("게시물 업로드 실패:", error);
      alert("게시물 업로드에 실패했습니다. 다시 시도해주세요.");
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
              onClick={() => setShowContentLibrary(true)}
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
        {uploadedFiles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">업로드된 콘텐츠</h4>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {uploadedFiles.length}개
                </span>
              </div>
              <button
                onClick={() => {
                  setUploadedFiles([]);
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
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                      selectedThumbnail === file.id
                        ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedThumbnail(file.id)}
                  >
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-24 object-cover"
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
                    {selectedThumbnail === file.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                        ✓ 대표
                      </div>
                    )}

                    {/* 파일명 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">
                        {file.name}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles((prev) =>
                          prev.filter((f) => f.id !== file.id)
                        );
                        if (selectedThumbnail === file.id) {
                          const remaining = uploadedFiles.filter(
                            (f) => f.id !== file.id
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
                {PLATFORMS.map((platform) => (
                  <label
                    key={platform.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="aiPlatform"
                      value={platform.id}
                      checked={aiOptions.platform === platform.id}
                      onChange={(e) => handleAiPlatformChange(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`px-3 py-2 ${platform.color} rounded-lg flex-1 text-center flex items-center justify-center`}
                    >
                      <img
                        src={platform.icon}
                        alt={platform.name}
                        className="w-4 h-4 mr-2"
                      />
                      {platform.name}
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
                        className="hover:bg-green-200 rounded-full p-1 transition-colors"
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
                  value={aiOptions.businessType}
                  onChange={(e) =>
                    setAiOptions((prev) => ({
                      ...prev,
                      businessType: e.target.value,
                    }))
                  }
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    !aiOptions.businessType ? "text-gray-500" : "text-gray-900"
                  }`}
                  style={{
                    color: !aiOptions.businessType ? "#6B7280" : "#111827",
                  }}
                >
                  <option value="" disabled>
                    {selectedStore?.industry
                      ? `${Store.getIndustryLabel(
                          selectedStore.industry
                        )} (매장 설정)`
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
              onClick={() => generateContent("full")}
              disabled={isGenerating || !selectedThumbnail}
              className="bg-purple-500 text-white px-4 py-2.5 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <Sparkles size={14} />
              <span>
                {isGenerating ? "생성 중..." : "제목 + 본문 + 해시태그 생성"}
              </span>
            </button>

            <button
              onClick={() => generateContent("hashtags")}
              disabled={
                isGenerating ||
                !selectedThumbnail ||
                (!postData.title.trim() && !postData.content.trim())
              }
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              <Hash size={14} />
              <span>{isGenerating ? "생성 중..." : "해시태그 생성"}</span>
              {!postData.title.trim() &&
                !postData.content.trim() &&
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
                {!postData.title.trim() &&
                  !postData.content.trim() &&
                  postData.hashtags.length === 0 && (
                    <div className="flex items-center space-x-2 text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>
                        제목, 본문, 해시태그를 한번에 모두 생성할 수 있습니다
                      </span>
                    </div>
                  )}
                {postData.title.trim() &&
                  postData.content.trim() &&
                  postData.hashtags.length === 0 && (
                    <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        작성하신 제목/본문에 어울리는 해시태그를 생성할 수
                        있습니다
                      </span>
                    </div>
                  )}
                {postData.title.trim() &&
                  !postData.content.trim() &&
                  postData.hashtags.length === 0 && (
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
            {generatedContent.title && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>
          <input
            type="text"
            value={postData.title}
            onChange={(e) => {
              setPostData((prev) => ({ ...prev, title: e.target.value }));
              setGeneratedContent((prev) => ({ ...prev, title: false }));
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
            {generatedContent.content && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>
          <textarea
            value={postData.content}
            onChange={(e) => {
              setPostData((prev) => ({ ...prev, content: e.target.value }));
              setGeneratedContent((prev) => ({ ...prev, content: false }));
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
            {generatedContent.hashtags && (
              <span className="inline-flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                <Sparkles size={10} />
                <span>AI 생성됨</span>
              </span>
            )}
          </div>

          {/* 해시태그 목록 */}
          {postData.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1 p-3 rounded-lg">
              {postData.hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center space-x-2 text-sm"
                >
                  <span>#{hashtag}</span>
                  <button
                    onClick={() => {
                      removeHashtag(index);
                      if (postData.hashtags.length === 1) {
                        setGeneratedContent((prev) => ({
                          ...prev,
                          hashtags: false,
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
                    addHashtag(value);
                    e.target.value = "";
                    setGeneratedContent((prev) => ({
                      ...prev,
                      hashtags: false,
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
              게시할 플랫폼 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {PLATFORMS.map((platform) => (
                <label
                  key={platform.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={publishOptions.platforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPublishOptions((prev) => ({
                          ...prev,
                          platforms: [...prev.platforms, platform.id],
                        }));
                      } else {
                        setPublishOptions((prev) => ({
                          ...prev,
                          platforms: prev.platforms.filter(
                            (p) => p !== platform.id
                          ),
                        }));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span
                    className={`px-3 py-2 ${platform.color} rounded-lg flex-1 text-center flex items-center justify-center`}
                  >
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-4 h-4 mr-2"
                    />
                    {platform.name}
                    {/* AI 대상 플랫폼 표시 */}
                    {platform.id === aiOptions.platform && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        AI 최적화
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              AI 대상 플랫폼(
              {PLATFORMS.find((p) => p.id === aiOptions.platform)?.name})이
              자동으로 선택되며, 추가로 다른 플랫폼도 선택할 수 있습니다.
            </p>
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
                  checked={publishOptions.scheduleType === "immediate"}
                  onChange={(e) =>
                    setPublishOptions((prev) => ({
                      ...prev,
                      scheduleType: e.target.value,
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
                  checked={publishOptions.scheduleType === "scheduled"}
                  onChange={(e) =>
                    setPublishOptions((prev) => ({
                      ...prev,
                      scheduleType: e.target.value,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>예약 게시</span>
              </label>
            </div>

            {/* 예약 옵션 */}
            {publishOptions.scheduleType === "scheduled" && (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 유튜브 미리보기 */}
              {publishOptions.platforms.includes("youtube") && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto">
                  {selectedThumbnail && (
                    <div className="relative aspect-[9/16] bg-black m-2">
                      <img
                        src={
                          uploadedFiles.find((f) => f.id === selectedThumbnail)
                            ?.url
                        }
                        alt="미리보기"
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
                      {postData.title || "비디오 제목"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {postData.content || "비디오 설명"}
                    </p>
                    {postData.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {postData.hashtags.map((tag, index) => (
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
              )}

              {/* 인스타그램 미리보기 */}
              {publishOptions.platforms.includes("instagram") && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm max-w-sm mx-auto">
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
                          uploadedFiles.find((f) => f.id === selectedThumbnail)
                            ?.url
                        }
                        alt="미리보기"
                        className="w-full h-full object-cover"
                      />
                      {uploadedFiles.find((f) => f.id === selectedThumbnail)
                        ?.type === "video" && (
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
                      <p className="text-xs text-gray-500">좋아요 234개</p>
                      <div className="text-sm">
                        <span className="font-semibold">your_store</span>
                        <span className="ml-2">
                          {postData.title && <strong>{postData.title}</strong>}
                          {postData.title && postData.content && <br />}
                          {postData.content}
                        </span>
                      </div>
                      {postData.hashtags.length > 0 && (
                        <div className="text-sm text-blue-600">
                          {postData.hashtags.map((tag, index) => (
                            <span key={index} className="mr-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 페이스북 미리보기 */}
              {publishOptions.platforms.includes("facebook") && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto">
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
                      {postData.title && (
                        <h3 className="font-semibold text-gray-900">
                          {postData.title}
                        </h3>
                      )}
                      {postData.content && (
                        <p className="text-gray-800">{postData.content}</p>
                      )}
                      {postData.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {postData.hashtags.map((tag, index) => (
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
                            uploadedFiles.find(
                              (f) => f.id === selectedThumbnail
                            )?.url
                          }
                          alt="미리보기"
                          className="w-full h-48 object-cover"
                        />
                        {uploadedFiles.find((f) => f.id === selectedThumbnail)
                          ?.type === "video" && (
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
                        👍 ❤️ 😊 234명이 좋아합니다
                      </span>
                      <span className="text-xs text-gray-500">댓글 12개</span>
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
              )}
            </div>

            {/* 미리보기 없을 때 */}
            {publishOptions.platforms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={24} className="text-gray-400" />
                </div>
                <p>플랫폼을 선택하면 미리보기를 볼 수 있습니다</p>
              </div>
            )}
          </div>
        )}
        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={
            !postData.title ||
            !postData.content ||
            publishOptions.platforms.length === 0
          }
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          업로드하기
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
      {showContentLibrary && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">콘텐츠 라이브러리</h2>
              <button
                onClick={() => setShowContentLibrary(false)}
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
                    value={contentLibrarySearch}
                    onChange={(e) => setContentLibrarySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={contentLibraryFilter}
                  onChange={(e) => setContentLibraryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="video">동영상</option>
                  <option value="image">이미지</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredContentLibrary().map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all"
                    onClick={() => handleSelectFromLibrary([item])}
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {item.type === "video" ? "📹" : "🖼️"} {item.type}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                      <p className="text-sm truncate">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowContentLibrary(false)}
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
