import { http, HttpResponse, passthrough } from "msw";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/api"
).replace("/api", "");

// ISO DateTime 형식 검증 헬퍼 함수
function isValidISODateTime(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

export const handlers = [
  // // 전역 딜레이 미들웨어
  // http.all('*', async () => {
  //   await delay(2000);
  // }),
  // 모든 HTTP 메서드에 대해 passthrough 조건 적용
  http.all("*", ({ request }) => {
    const url = new URL(request.url);
    const workingEndpoints = [
      "/api/auth",
      "/api/stores",
      "/api/videos",
      "/api/images",
    ];

    // msw 작동 안하는 조건들
    const isStaticFile = /\.(css|js|png|jpg|svg|ico|woff|woff2|ttf|eot)$/.test(
      url.pathname
    );
    const isNotHost = url.origin !== API_BASE_URL;
    const isWorkingEndpoint = workingEndpoints.some((endpoint) =>
      url.pathname.includes(endpoint)
    );
    if (isStaticFile || isNotHost || isWorkingEndpoint) {
      console.log("🛳️ passthrough", url.pathname, {
        isStaticFile,
        isNotHost,
        isWorkingEndpoint,
      });
      return passthrough();
    }
    console.log("🍪 MSW", url.pathname);
  }),
  http.post(`${API_BASE_URL}/api/auth/new`, async ({ request }) => {
    const { email, password, name, phoneNumber } = await request.json();

    if (!email || !password || !name || !phoneNumber) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "모든 필드를 입력해주세요.",
          result: null,
          errors: [
            {
              field: "email",
              message: "이메일을 입력해주세요.",
            },
          ],
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "회원가입이 완료되었습니다.",
      result: {
        type: "USER",
        accessToken: "mock-access-token",
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: "mock-refresh-token",
        refreshTokenExpiration: Date.now() + 2592000000, // 30일
      },
      errors: [],
    });
  }),

  // 로그인
  http.post(`${API_BASE_URL}/api/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();

    if (!email || !password) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "아이디와 비밀번호를 입력해주세요.",
          result: null,
          errors: [
            {
              field: "email",
              message: "이메일을 입력해주세요.",
            },
          ],
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: {
        type: "USER",
        accessToken: "mock-access-token",
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: "mock-refresh-token",
        refreshTokenExpiration: Date.now() + 2592000000, // 30일
      },
      errors: [],
    });
  }),

  // 로그아웃
  http.post(`${API_BASE_URL}/api/auth/logout`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "로그아웃되었습니다.",
      result: "로그아웃 성공",
      errors: [],
    });
  }),

  // 토큰 갱신
  http.post(`${API_BASE_URL}/api/auth/refresh`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "토큰이 갱신되었습니다.",
      result: {
        type: "USER",
        accessToken: "new-mock-access-token",
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: "new-mock-refresh-token",
        refreshTokenExpiration: Date.now() + 2592000000, // 30일
      },
      errors: [],
    });
  }),

  // 내 정보 조회
  http.get(`${API_BASE_URL}/api/auth/me`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: {
        memberId: 1,
        loginId: "test@test.com",
        name: "테스트 사용자",
      },
    });
  }),

  // OAuth2 구글 로그인
  http.get(`${API_BASE_URL}/api/oauth2/authorization/google`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "구글 로그인 리다이렉트",
      result: {
        redirectUrl:
          "https://accounts.google.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/auth/google/callback",
      },
    });
  }),

  // OAuth2 카카오 로그인
  http.get(`${API_BASE_URL}/api/oauth2/authorization/kakao`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "카카오 로그인 리다이렉트",
      result: {
        redirectUrl:
          "https://kauth.kakao.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/auth/kakao/callback",
      },
    });
  }),

  // 게시글 목록 조회 (페이지네이션)
  http.get(`${API_BASE_URL}/api/articles`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const size = parseInt(url.searchParams.get("size")) || 10;
    const keyword = url.searchParams.get("keyword") || "";

    // 목 데이터 생성
    const totalItems = 45;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, totalItems);

    const articles = Array.from({ length: endIndex - startIndex }, (_, i) => ({
      articleId: startIndex + i + 1,
      title: `게시글 제목 ${startIndex + i + 1}${
        keyword ? ` - ${keyword}` : ""
      }`,
      content: `게시글 내용 ${startIndex + i + 1}입니다.`,
      author: `작성자${startIndex + i + 1}`,
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: {
        articles,
        pagination: {
          page,
          size,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
    });
  }),

  // 게시글 상세 조회
  http.get(`${API_BASE_URL}/api/articles/:articleId`, ({ params }) => {
    if (!params.articleId) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "게시글 ID가 필요합니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: {
        articleId: params.articleId,
        title: `게시글 제목 ${params.articleId}`,
        content: `이것은 게시글 ${params.articleId}의 상세 내용입니다. 여러 줄의 텍스트가 들어갈 수 있습니다.`,
        author: `작성자${params.articleId}`,
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        createdAt: "2025-01-15T10:30:00",
        updatedAt: "2025-01-16T14:20:00",
        comments: [
          {
            commentId: 1,
            content: "첫 번째 댓글입니다.",
            author: "댓글작성자1",
            createdAt: "2025-01-15T11:00:00",
          },
          {
            commentId: 2,
            content: "두 번째 댓글입니다.",
            author: "댓글작성자2",
            createdAt: "2025-01-15T12:30:00",
          },
        ],
      },
    });
  }),

  // 게시글 생성
  http.post(`${API_BASE_URL}/api/articles`, async ({ request }) => {
    const data = await request.json();

    if (!data.title || !data.content) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "제목과 내용을 입력해주세요.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "게시글이 생성되었습니다.",
      result: {
        articleId: Math.floor(Math.random() * 1000) + 100,
        ...data,
        author: "현재사용자",
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // 게시글 수정
  http.put(
    `${API_BASE_URL}/api/articles/:articleId`,
    async ({ params, request }) => {
      if (!params.articleId) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "게시글 ID가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      const data = await request.json();
      if (!data.title || !data.content) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "제목과 내용을 입력해주세요.",
            result: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        message: "게시글이 수정되었습니다.",
        result: {
          articleId: params.articleId,
          ...data,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  ),

  // 게시글 삭제
  http.delete(`${API_BASE_URL}/api/articles/:articleId`, ({ params }) => {
    if (!params.articleId) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "게시글 ID가 필요합니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "게시글이 삭제되었습니다.",
      result: null,
    });
  }),

  // ===== 매장 관리 API =====

  // 매장 목록 조회
  http.get(`${API_BASE_URL}/api/stores`, () => {
    const stores = [
      {
        id: 1,
        userId: 1,
        name: "카페 달콤",
        address: "서울시 강남구 테헤란로 123",
        phoneNumber: "02-1234-5678",
        businessNumber: "123-45-67890",
        latitude: 37.5665,
        longitude: 126.978,
        industry: "FOOD",
      },
      {
        id: 2,
        userId: 1,
        name: "맛있는 분식",
        address: "서울시 마포구 홍대로 456",
        phoneNumber: "02-2345-6789",
        businessNumber: "234-56-78901",
        latitude: 37.5565,
        longitude: 126.928,
        industry: "FOOD",
      },
      {
        id: 3,
        userId: 1,
        name: "스타일 의류",
        address: "서울시 서초구 반포대로 789",
        phoneNumber: "02-3456-7890",
        businessNumber: "345-67-89012",
        latitude: 37.5465,
        longitude: 126.918,
        industry: "RETAIL",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: stores,
    });
  }),

  // 매장 생성
  http.post(`${API_BASE_URL}/api/stores`, async ({ request }) => {
    const data = await request.json();

    if (!data.name || !data.address || !data.phoneNumber || !data.industry) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "매장명, 주소, 연락처, 업종을 입력해주세요.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "매장이 등록되었습니다.",
      result: {
        id: Math.floor(Math.random() * 1000) + 100,
        userId: 1,
        ...data,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // 매장 수정 (PATCH 사용)
  http.patch(
    `${API_BASE_URL}/api/stores/:storeId`,
    async ({ params, request }) => {
      const data = await request.json();

      return HttpResponse.json({
        isSuccess: true,
        message: "매장 정보가 수정되었습니다.",
        result: {
          id: params.storeId,
          userId: 1,
          ...data,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  ),

  // 매장 삭제
  http.delete(`${API_BASE_URL}/api/stores/:storeId`, ({ params }) => {
    return HttpResponse.json({
      isSuccess: true,
      message: "매장이 삭제되었습니다.",
      result: null,
    });
  }),

  // ===== 분석 API =====

  // 대시보드 통계
  http.get(`${API_BASE_URL}/api/analytics/dashboard`, ({ request }) => {
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "last7";

    const stats = [
      {
        type: "views",
        value: 1254,
        change: "+12.5%",
      },
      {
        type: "likes",
        value: 342,
        change: "+8.3%",
      },
      {
        type: "comments",
        value: 87,
        change: "+15.2%",
      },
      {
        type: "shares",
        value: 54,
        change: "+5.7%",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: stats,
    });
  }),

  // 콘텐츠 성과 분석
  http.get(`${API_BASE_URL}/api/analytics/content-performance`, () => {
    const performance = [
      {
        id: 1,
        title: "카페 달콤 신메뉴 소개",
        views: 2456,
        likes: 342,
        comments: 87,
        shares: 54,
        platform: "instagram",
      },
      {
        id: 2,
        title: "여름 신상품 컬렉션",
        views: 1845,
        likes: 256,
        comments: 62,
        shares: 38,
        platform: "facebook",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: performance,
    });
  }),

  // 댓글 감성 분석
  http.get(`${API_BASE_URL}/api/analytics/comment-sentiment`, () => {
    const sentiment = [
      {
        sentiment: "positive",
        count: 245,
        percentage: 65,
      },
      {
        sentiment: "neutral",
        count: 87,
        percentage: 23,
      },
      {
        sentiment: "negative",
        count: 45,
        percentage: 12,
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: sentiment,
    });
  }),

  // 팔로워 트렌드
  http.get(`${API_BASE_URL}/api/analytics/follower-trend`, () => {
    const trend = {
      totalFollowers: 2145,
      newFollowers: 156,
      unfollowers: 32,
      netGrowth: 124,
      weeklyData: [35, 42, 38, 45, 40, 48, 52],
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: trend,
    });
  }),

  // 최적 게시 시간
  http.get(`${API_BASE_URL}/api/analytics/optimal-posting-time`, () => {
    const optimalTimes = {
      instagram: ["18-20시", "12-14시", "21-23시"],
      facebook: ["10-12시", "15-17시", "19-21시"],
      recommendation: "월요일 오후 6시",
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: optimalTimes,
    });
  }),

  // ===== 이미지 관리 API =====

  // 이미지 목록 조회
  http.get(`${API_BASE_URL}/api/images`, ({ request }) => {
    const url = new URL(request.url);
    const sortBy = url.searchParams.get("sortBy") || "recent";
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const size = parseInt(url.searchParams.get("size")) || 20;
    const userId = url.searchParams.get("userId");

    // 목업 이미지 데이터
    let mockImages = [
      {
        id: 1,
        title: "카페 신메뉴 이미지",
        description: "달콤한 디저트와 함께하는 새로운 음료",
        imageUrl: "https://picsum.photos/400/300?random=1",
        thumbnailUrl: "https://picsum.photos/200/150?random=1",
        fileName: "cafe-menu-1.jpg",
        fileSize: 245760,
        mimeType: "image/jpeg",
        userId: "user123",
        author: "카페 운영자",
        views: 245,
        likes: 32,
        createdAt: "2024-08-17T10:30:00Z",
        updatedAt: "2024-08-17T10:30:00Z",
      },
      {
        id: 2,
        title: "여름 시즌 프로모션",
        description: "시원한 여름 음료 특가 행사",
        imageUrl: "https://picsum.photos/400/300?random=2",
        thumbnailUrl: "https://picsum.photos/200/150?random=2",
        fileName: "summer-promo.png",
        fileSize: 180240,
        mimeType: "image/png",
        userId: "user123",
        author: "마케팅팀",
        views: 189,
        likes: 24,
        createdAt: "2024-08-16T14:20:00Z",
        updatedAt: "2024-08-16T14:20:00Z",
      },
      {
        id: 3,
        title: "매장 인테리어",
        description: "새롭게 단장한 매장 내부 모습",
        imageUrl: "https://picsum.photos/400/300?random=3",
        thumbnailUrl: "https://picsum.photos/200/150?random=3",
        fileName: "interior-design.jpg",
        fileSize: 312450,
        mimeType: "image/jpeg",
        userId: "user123",
        author: "매장 관리자",
        views: 156,
        likes: 18,
        createdAt: "2024-08-15T09:15:00Z",
        updatedAt: "2024-08-15T09:15:00Z",
      },
      {
        id: 4,
        title: "이벤트 포스터",
        description: "특별 할인 이벤트 안내",
        imageUrl: "https://picsum.photos/400/300?random=4",
        thumbnailUrl: "https://picsum.photos/200/150?random=4",
        fileName: "event-poster.jpg",
        fileSize: 425120,
        mimeType: "image/jpeg",
        userId: "user456",
        author: "이벤트팀",
        views: 298,
        likes: 45,
        createdAt: "2024-08-14T16:45:00Z",
        updatedAt: "2024-08-14T16:45:00Z",
      },
    ];

    // 검색 필터링
    if (search) {
      mockImages = mockImages.filter(
        (image) =>
          image.title.toLowerCase().includes(search.toLowerCase()) ||
          image.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 사용자 필터링
    if (userId) {
      mockImages = mockImages.filter((image) => image.userId === userId);
    }

    // 정렬
    mockImages.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes;
        case "views":
          return b.views - a.views;
        case "recent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // 페이지네이션
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedImages = mockImages.slice(startIndex, endIndex);

    return HttpResponse.json({
      isSuccess: true,
      message: "이미지 목록 조회 성공",
      result: {
        images: paginatedImages,
        pagination: {
          page,
          size,
          totalItems: mockImages.length,
          totalPages: Math.ceil(mockImages.length / size),
          hasNext: endIndex < mockImages.length,
          hasPrevious: page > 1,
        },
      },
    });
  }),

  // 이미지 업로드
  http.post(`${API_BASE_URL}/api/images/upload`, async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");

    // 파일 검증
    if (!file) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "업로드할 파일이 없습니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    if (!title) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "이미지 제목을 입력해주세요.",
          result: null,
        },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "파일 크기는 10MB를 초과할 수 없습니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message:
            "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 지원)",
          result: null,
        },
        { status: 400 }
      );
    }

    // 성공 응답 (실제로는 파일이 서버에 저장되고 URL이 생성됨)
    const imageId = Math.floor(Math.random() * 10000) + 1000;
    const imageUrl = `https://picsum.photos/400/300?random=${imageId}`;
    const thumbnailUrl = `https://picsum.photos/200/150?random=${imageId}`;

    return HttpResponse.json({
      isSuccess: true,
      message: "이미지 업로드 성공",
      result: {
        id: imageId,
        title: title,
        description: description || "",
        imageUrl: imageUrl,
        thumbnailUrl: thumbnailUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        userId: userId,
        author: "현재 사용자",
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // 이미지 상세 조회
  http.get(`${API_BASE_URL}/api/images/:imageId`, ({ params }) => {
    const imageId = parseInt(params.imageId);

    // 목업 데이터에서 찾기
    const mockImage = {
      id: imageId,
      title: `이미지 ${imageId}`,
      description: `이미지 ${imageId}에 대한 상세 설명입니다.`,
      imageUrl: `https://picsum.photos/800/600?random=${imageId}`,
      thumbnailUrl: `https://picsum.photos/200/150?random=${imageId}`,
      fileName: `image-${imageId}.jpg`,
      fileSize: 256000 + imageId * 1000,
      mimeType: "image/jpeg",
      userId: "user123",
      author: "사용자",
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      tags: ["카페", "음료", "디저트"],
      metadata: {
        width: 800,
        height: 600,
        colorDepth: 24,
        hasAlpha: false,
      },
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "이미지 상세 조회 성공",
      result: mockImage,
    });
  }),

  // 이미지 메타데이터 수정
  http.patch(
    `${API_BASE_URL}/api/images/:imageId`,
    async ({ params, request }) => {
      const imageId = params.imageId;
      const updateData = await request.json();

      if (!updateData.title && !updateData.description) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "수정할 데이터가 없습니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        message: "이미지 정보가 수정되었습니다.",
        result: {
          id: imageId,
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  ),

  // 이미지 삭제
  http.delete(`${API_BASE_URL}/api/images/:imageId`, ({ params, request }) => {
    const imageId = params.imageId;
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "사용자 ID가 필요합니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: "이미지가 삭제되었습니다.",
      result: {
        deletedImageId: imageId,
        deletedAt: new Date().toISOString(),
      },
    });
  }),

  //콘텐츠 api

  // 콘텐츠 목록 조회
  http.get(`${API_BASE_URL}/api/content`, ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "videos";

    const contents = [
      {
        id: 1,
        title: "카페 달콤 신메뉴 소개",
        type: "video",
        duration: "00:15",
        createdAt: "2023-06-15",
        views: 245,
        likes: 32,
        store: "카페 달콤",
      },
      {
        id: 2,
        title: "여름 신상품 컬렉션",
        type: "video",
        duration: "00:22",
        createdAt: "2023-06-10",
        views: 189,
        likes: 24,
        store: "스타일 의류",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: contents,
    });
  }),

  // 콘텐츠 생성 (AI)
  http.post(`${API_BASE_URL}/api/content`, async ({ request }) => {
    const data = await request.json();

    return HttpResponse.json({
      isSuccess: true,
      message: "콘텐츠 생성이 시작되었습니다.",
      result: {
        contentId: Math.floor(Math.random() * 1000) + 100,
        status: "processing",
        estimatedTime: "2분",
      },
    });
  }),

  // 콘텐츠 생성 상태 확인
  http.get(`${API_BASE_URL}/api/content/:contentId/status`, ({ params }) => {
    const statuses = ["processing", "completed", "failed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: {
        contentId: params.contentId,
        status: randomStatus,
        progress:
          randomStatus === "processing" ? Math.floor(Math.random() * 100) : 100,
      },
    });
  }),

  // 시나리오 목록 조회
  http.get(`${API_BASE_URL}/api/content/scenarios`, () => {
    const scenarios = [
      {
        id: 1,
        title: "시나리오 1",
        description:
          "매장 제품을 다양한 각도에서 보여주고, 사용하는 모습을 담은 실용적인 숏폼",
        recommended: true,
      },
      {
        id: 2,
        title: "시나리오 2",
        description:
          "제품의 특징을 강조하며 트렌디한 배경음악과 함께 감성적인 분위기를 연출하는 숏폼",
        recommended: false,
      },
      {
        id: 3,
        title: "시나리오 3",
        description:
          "매장의 특별한 이벤트나 할인 정보를 재미있게 소개하는 홍보 중심의 숏폼",
        recommended: false,
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "성공입니다.",
      result: scenarios,
    });
  }),

  // ===== SNS Service API (10개) =====

  // 1. AI 포스트 생성
  http.post(`${API_BASE_URL}/api/posts/ai/post`, async ({ request }) => {
    const {
      content_data,
      user_keywords,
      sns_platform,
      business_type,
      location,
    } = await request.json();

    if (!content_data || !sns_platform || !business_type) {
      return HttpResponse.json(
        {
          error: "content_data, sns_platform, business_type는 필수입니다.",
        },
        { status: 400 }
      );
    }

    // 키워드 기반 제목/본문 생성
    const keywordText =
      user_keywords?.length > 0 ? ` (${user_keywords.join(", ")})` : "";
    const locationText = location ? ` - ${location}` : "";

    // 실제 서버 응답 형식 (CreatePostResponse)
    return HttpResponse.json({
      title: `${business_type}의 새로운 소식${keywordText} 🌟`,
      content: `안녕하세요! ${business_type}에서 특별한 소식을 전해드립니다.${
        locationText ? ` ${location}에서` : ""
      } 만나보실 수 있는 새로운 경험을 준비했습니다. ${
        user_keywords?.length > 0
          ? `특히 ${user_keywords.join(", ")} 관련하여 `
          : ""
      }많은 관심 부탁드립니다!`,
      hashtags: [
        ...(user_keywords || []),
        "신상품",
        "특가",
        "이벤트",
        sns_platform,
      ].slice(0, 10),
    });
  }),

  // 2. AI 해시태그 생성
  http.post(`${API_BASE_URL}/api/posts/ai/hashtags`, async ({ request }) => {
    const {
      post_title,
      post_content,
      user_keywords,
      sns_platform,
      business_type,
      location,
    } = await request.json();

    if (!post_title || !post_content || !sns_platform || !business_type) {
      return HttpResponse.json(
        {
          error:
            "post_title, post_content, sns_platform, business_type는 필수입니다.",
        },
        { status: 400 }
      );
    }

    // 제목과 본문에서 키워드 추출하여 해시태그 생성
    const titleWords = post_title.split(" ").filter((word) => word.length > 1);
    const contentWords = post_content
      .split(" ")
      .filter((word) => word.length > 1)
      .slice(0, 3);

    // 실제 서버 응답 형식 (CreateHashtagResponse)
    return HttpResponse.json({
      hashtags: [
        ...(user_keywords || []),
        ...titleWords.slice(0, 2),
        ...contentWords,
        "트렌드",
        "인기",
        "추천",
        sns_platform,
        business_type,
      ].slice(0, 15),
    });
  }),

  // 3. SNS 계정 정보 조회
  http.get(
    `${API_BASE_URL}/api/sns/account/:snsType`,
    ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const storeId = headers["x-store-id"];

      if (!userId || !storeId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID와 X-STORE-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      // 실제 서버 응답 형식 (SnsAccountResponse)
      return HttpResponse.json({
        code: "200",
        message: "성공",
        data: {
          id: 1,
          userId: parseInt(userId),
          storeId: parseInt(storeId),
          snsType: snsType,
          snsAccountId: `${snsType}_account_${storeId}`,
          snsAccountName: `매장 ${storeId} ${snsType} 계정`,
          snsAccountDescription: `${snsType} 공식 계정입니다.`,
          snsAccountUrl: `https://${snsType}.com/channel/${snsType}_account_${storeId}`,
          follower: Math.floor(Math.random() * 10000) + 1000,
          postCount: Math.floor(Math.random() * 100) + 10,
          viewCount: Math.floor(Math.random() * 100000) + 10000,
          keyword: ["맛집", "카페", "신메뉴", "이벤트"],
        },
      });
    }
  ),

  // 4. SNS 계정 정보 업데이트
  http.put(
    `${API_BASE_URL}/api/sns/account/:snsType`,
    async ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const data = await request.json();

      if (!userId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      if (!data.storeId || !data.snsAccountId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "storeId와 snsAccountId는 필수입니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // 5. SNS 계정 포스트 목록 조회
  http.get(
    `${API_BASE_URL}/api/sns/account/:snsType/list`,
    ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const storeId = headers["x-store-id"];

      if (!userId || !storeId) {
        return HttpResponse.json(
          {
            error: "X-USER-ID와 X-STORE-ID 헤더가 필요합니다.",
          },
          { status: 400 }
        );
      }

      // 목업 포스트 데이터
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

      // 개발용으로 목업 데이터 반환 (실제로는 빈 응답)
      return HttpResponse.json(mockPosts);
    }
  ),

  // 6. 비디오 업로드
  http.post(
    `${API_BASE_URL}/api/sns/video/:snsType/upload`,
    async ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const data = await request.json();

      if (!userId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      if (
        !data.storeId ||
        !data.title ||
        !data.description ||
        !data.contentPath ||
        !Array.isArray(data.tags)
      ) {
        return HttpResponse.json(
          {
            code: "400",
            message:
              "storeId, title, description, contentPath, tags는 필수입니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      // YouTube 세부 정보 검증
      if (snsType === "youtube" && data.detail) {
        const { categoryId, notifySubscribers, publishAt } = data.detail;

        if (!categoryId) {
          return HttpResponse.json(
            {
              code: "400",
              message: "YouTube 업로드 시 categoryId는 필수입니다.",
              data: null,
            },
            { status: 400 }
          );
        }

        // publishAt이 있는 경우 형식 검증
        if (publishAt && !isValidISODateTime(publishAt)) {
          return HttpResponse.json(
            {
              code: "400",
              message:
                "publishAt은 ISO 8601 형식이어야 합니다. (예: 2024-01-01T10:00:00Z)",
              data: null,
            },
            { status: 400 }
          );
        }
      }

      // 성공 응답 (백엔드 PostUploadResponse 형식)
      return HttpResponse.json({
        code: "200",
        message: "업로드 성공",
        data: {
          postId: `${snsType}_${Date.now()}`,
          videoId: `video_${Date.now()}`,
          uploadStatus: "completed",
          publishedAt: data.detail?.publishAt || new Date().toISOString(),
          viewUrl: `https://${snsType}.com/watch?v=mock_${Date.now()}`,
        },
      });
    }
  ),

  // 7. 비디오 업데이트
  http.put(
    `${API_BASE_URL}/api/sns/video/:snsType/update`,
    async ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const data = await request.json();

      if (!userId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      if (!data.postId || !data.storeId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "postId와 storeId는 필수입니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      return new HttpResponse(null, { status: 200 });
    }
  ),

  // 8. 비디오 삭제
  http.delete(
    `${API_BASE_URL}/api/sns/video/:snsType/delete`,
    async ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];

      // DELETE 요청의 body 읽기
      const data = await request.json();

      if (!userId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      if (!data.postId || !data.storeId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "postId와 storeId는 필수입니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        code: "200",
        message: "비디오가 성공적으로 삭제되었습니다.",
        data: {
          deletedPostId: data.postId,
          deletedAt: new Date().toISOString(),
          status: "deleted",
        },
      });
    }
  ),

  // 9. OAuth 인증 URL 조회
  http.get(
    `${API_BASE_URL}/api/sns/oauth/:snsType/url`,
    ({ params, request }) => {
      const { snsType } = params;
      const headers = Object.fromEntries(request.headers.entries());
      const userId = headers["x-user-id"];
      const storeId = headers["x-store-id"];

      if (!userId || !storeId) {
        return HttpResponse.json(
          {
            code: "400",
            message: "X-USER-ID와 X-STORE-ID 헤더가 필요합니다.",
            data: null,
          },
          { status: 400 }
        );
      }

      // state 값을 base64로 인코딩 (브라우저 호환)
      const stateData = `${userId}:${storeId}:${btoa(
        JSON.stringify({ userId, storeId })
      )}`;

      const authUrls = {
        youtube: `https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=818263738112-3fjds0ch51ri6gk0con6ot3l4fbdp9oi.apps.googleusercontent.com&redirect_uri=https://aivle.r-e.kr/api/sns/oauth/youtube/callback&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&state=${stateData}`,
        instagram: `https://api.instagram.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:5173/auth/instagram/callback&scope=user_profile&state=${storeId}`,
        facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=mock&redirect_uri=http://localhost:5173/auth/facebook/callback&scope=pages_manage_posts&state=${storeId}`,
      };

      return new HttpResponse(authUrls[snsType] || authUrls.youtube, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }
  ),

  // 10. OAuth 콜백 처리
  http.get(
    `${API_BASE_URL}/api/sns/oauth/:snsType/callback`,
    ({ params, request }) => {
      const { snsType } = params;
      const url = new URL(request.url);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (!code || !state) {
        return new HttpResponse("인증 코드가 없습니다.", {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        });
      }

      return new HttpResponse("계정 연동 완료", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }
  ),
];
