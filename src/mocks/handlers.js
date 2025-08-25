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
      // "/api/auth",
      // "/api/stores",
      // "/api/shorts",
      // "/api/contents",
      // "/api/sns",
      // "/api/content",
      // '/api/analytics', // analytics API 활성화
    ];

    // msw 작동 안하는 조건들
    const isStaticFile = /\.(css|js|png|jpg|svg|ico|woff|woff2|ttf|eot)$/.test(
      url.pathname
    );
    const isNotHost = url.origin !== API_BASE_URL;
    const isWorkingEndpoint = workingEndpoints.some((endpoint) =>
      url.pathname.includes(endpoint)
    );
    const isLocalHost = url.origin === "http://localhost:8080";
    if (isStaticFile || isNotHost || isWorkingEndpoint || isLocalHost) {
      console.log("🛳️ passthrough", url.pathname, {
        isStaticFile,
        isNotHost,
        isWorkingEndpoint,
        isLocalHost,
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

  // ===== SNS API =====
  
  // SNS 계정 정보 조회
  http.get(`${API_BASE_URL}/api/sns/accounts/:snsType`, ({ params }) => {
    const snsType = params.snsType;
    
    // snsType에 따른 다른 응답 데이터
    const accountData = {
      youtube: {
        accountId: "UC123456789",
        channelName: "카페 달콤",
        channelUrl: "https://www.youtube.com/channel/UC123456789",
        subscriberCount: 15420,
        videoCount: 89,
        viewCount: 2345678,
        description: "달콤한 순간을 만들어가는 카페 달콤입니다.",
        profileImageUrl: "https://picsum.photos/200/200?random=1",
        bannerImageUrl: "https://picsum.photos/1200/300?random=1",
        isVerified: true,
        createdAt: "2020-03-15T10:30:00Z",
        lastUpdated: new Date().toISOString(),
        status: "active"
      },
      instagram: {
        accountId: "178414123456789",
        username: "cafe_dalkom",
        displayName: "카페 달콤",
        profileUrl: "https://www.instagram.com/cafe_dalkom",
        followerCount: 8920,
        followingCount: 245,
        postCount: 156,
        bio: "달콤한 순간을 만들어가는 카페 달콤 ☕️🍰",
        profileImageUrl: "https://picsum.photos/200/200?random=2",
        isPrivate: false,
        isVerified: false,
        createdAt: "2020-05-20T14:20:00Z",
        lastUpdated: new Date().toISOString(),
        status: "active"
      },
      facebook: {
        accountId: "123456789012345",
        pageName: "카페 달콤",
        pageUrl: "https://www.facebook.com/cafedalkom",
        followerCount: 5670,
        likeCount: 5430,
        postCount: 234,
        description: "달콤한 순간을 만들어가는 카페 달콤입니다.",
        profileImageUrl: "https://picsum.photos/200/200?random=3",
        coverImageUrl: "https://picsum.photos/1200/400?random=3",
        isVerified: true,
        category: "Restaurant",
        createdAt: "2020-02-10T09:15:00Z",
        lastUpdated: new Date().toISOString(),
        status: "active"
      },
      tiktok: {
        accountId: "tiktok123456789",
        username: "@cafe_dalkom",
        displayName: "카페 달콤",
        profileUrl: "https://www.tiktok.com/@cafe_dalkom",
        followerCount: 12340,
        followingCount: 180,
        videoCount: 67,
        likeCount: 456789,
        bio: "달콤한 순간을 만들어가는 카페 달콤 🍰☕️",
        profileImageUrl: "https://picsum.photos/200/200?random=4",
        isVerified: false,
        createdAt: "2021-08-15T16:45:00Z",
        lastUpdated: new Date().toISOString(),
        status: "active"
      }
    };

    const data = accountData[snsType];
    
    if (!data) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: "지원하지 않는 SNS 타입입니다.",
          result: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      message: `${snsType} 계정 정보 조회 성공`,
      result: data,
    });
  }),
  
  // SNS 포스트 목록 조회
  http.get(`${API_BASE_URL}/api/sns/posts`, () => {
    const posts = [
      {
        id: 1,
        postId: 1,
        title: "카페 달콤 신메뉴 소개",
        content: "새로운 시즌 메뉴를 소개합니다!",
        snsType: "youtube",
        createdAt: "2023-06-15T10:30:00Z",
        status: "published"
      },
      {
        id: 2,
        postId: 2,
        title: "여름 신상품 컬렉션",
        content: "시원한 여름을 위한 새로운 컬렉션",
        snsType: "instagram",
        createdAt: "2023-06-10T14:20:00Z",
        status: "published"
      },
      {
        id: 3,
        postId: 3,
        title: "바리스타 추천 커피",
        content: "오늘의 추천 커피를 소개합니다",
        snsType: "youtube",
        createdAt: "2023-06-08T09:15:00Z",
        status: "published"
      },
      {
        id: 4,
        postId: 4,
        title: "주말 브런치 메뉴",
        content: "특별한 주말을 위한 브런치 메뉴",
        snsType: "facebook",
        createdAt: "2023-06-05T16:45:00Z",
        status: "published"
      },
      {
        id: 5,
        postId: 5,
        title: "매장 인테리어 투어",
        content: "새롭게 단장한 매장을 소개합니다",
        snsType: "instagram",
        createdAt: "2023-06-01T11:00:00Z",
        status: "published"
      }
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "SNS 포스트 목록 조회 성공",
      result: posts,
    });
  }),

  // ===== 콘텐츠 API =====

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

  // ===== 콘텐츠 API =====
  
  // 콘텐츠 목록 조회
  http.get(`${API_BASE_URL}/api/contents`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const size = parseInt(url.searchParams.get("size")) || 10;
    const type = url.searchParams.get("type") || "videos";

    const contents = [
      {
        id: 1,
        contentId: 1,
        title: "카페 달콤 신메뉴 소개",
        type: "video",
        duration: "00:15",
        createdAt: "2023-06-15",
        views: 245,
        likes: 32,
        store: "카페 달콤",
        snsType: "youtube"
      },
      {
        id: 2,
        contentId: 2,
        title: "여름 신상품 컬렉션",
        type: "video",
        duration: "00:22",
        createdAt: "2023-06-10",
        views: 189,
        likes: 24,
        store: "스타일 의류",
        snsType: "instagram"
      },
      {
        id: 3,
        contentId: 3,
        title: "바리스타 추천 커피 레시피",
        type: "video",
        duration: "00:18",
        createdAt: "2023-06-08",
        views: 156,
        likes: 18,
        store: "카페 달콤",
        snsType: "youtube"
      },
      {
        id: 4,
        contentId: 4,
        title: "주말 브런치 메뉴 소개",
        type: "video",
        duration: "00:25",
        createdAt: "2023-06-05",
        views: 134,
        likes: 15,
        store: "카페 달콤",
        snsType: "facebook"
      },
      {
        id: 5,
        contentId: 5,
        title: "매장 인테리어 투어",
        type: "video",
        duration: "00:30",
        createdAt: "2023-06-01",
        views: 98,
        likes: 12,
        store: "스타일 의류",
        snsType: "instagram"
      }
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "콘텐츠 목록 조회 성공",
      result: contents,
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

  // ===== Analytics API Mocks =====

  // ===== 실시간 API =====

  // 실시간 계정 메트릭 조회
  http.get(
    `${API_BASE_URL}/api/analytics/realtime/accounts/metrics`,
    ({ request }) => {
      const url = new URL(request.url);
      const snsType = url.searchParams.get("snsType");

      if (!snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.AccountMetricsResponse",
          accountId: 123,
          followers: 43400,
          views: 13739858,
          fetchedAt: new Date().toISOString(),
          snsType: snsType.toUpperCase(),
        },
      });
    }
  ),

  // 실시간 게시물 메트릭 조회
  http.get(
    `${API_BASE_URL}/api/analytics/realtime/posts/metrics`,
    ({ request }) => {
      const url = new URL(request.url);
      const snsType = url.searchParams.get("snsType");
      const postId = url.searchParams.get("postId");

      if (!snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      // postId에 따라 다른 데이터 반환
      const metricsData = {
        1: { views: 115374, likes: 6032, comments: 198, shares: 50 },
        2: { views: 89234, likes: 3456, comments: 234, shares: 30 },
        3: { views: 23456, likes: 1234, comments: 89, shares: 15 },
        4: { views: 34567, likes: 1890, comments: 156, shares: 25 },
        5: { views: 67890, likes: 2987, comments: 267, shares: 40 },
      };

      const data = postId
        ? metricsData[postId] || {
            views: 15000,
            likes: 800,
            comments: 120,
            shares: 20,
          }
        : metricsData[1]; // postId가 없으면 첫 번째 게시물 데이터

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostMetricsResponse",
          postId: postId ? parseInt(postId) : 1,
          accountId: 123,
          likes: data.likes,
          dislikes: 10,
          comments: data.comments,
          shares: data.shares,
          views: data.views,
          fetchedAt: new Date().toISOString(),
          snsType: snsType.toUpperCase(),
        },
      });
    }
  ),

  // 실시간 게시물 댓글 조회
  http.get(
    `${API_BASE_URL}/api/analytics/realtime/posts/comments`,
    ({ request }) => {
      const url = new URL(request.url);
      const snsType = url.searchParams.get("snsType");
      const postId = url.searchParams.get("postId");
      const page = parseInt(url.searchParams.get("page")) || 0;
      const size = parseInt(url.searchParams.get("size")) || 20;

      if (!snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      const comments = [
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_1`,
          authorId: "user123456789",
          text: "정말 맛있어 보여요! 다음에 꼭 가보고 싶습니다 😋",
          likeCount: 15,
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_2`,
          authorId: "user987654321",
          text: "인테리어가 너무 예쁘네요. 분위기 좋아 보여요!",
          likeCount: 8,
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_3`,
          authorId: "user456789123",
          text: "가격대비 퀄리티가 정말 좋은 것 같아요 👍",
          likeCount: 12,
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_4`,
          authorId: "user789123456",
          text: "주차는 어떻게 되나요?",
          likeCount: 3,
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_5`,
          authorId: "user321654987",
          text: "사진이 너무 잘 나와요! 카메라 앵글 대박 👏",
          likeCount: 20,
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        },
      ].slice(0, Math.min(size, 5));

      return HttpResponse.json({
        isSuccess: true,
        message: "실시간 댓글 조회 성공",
        result: comments,
      });
    }
  ),

  // ===== 히스토리 API =====

  // 히스토리 계정 메트릭 조회
  http.get(
    `${API_BASE_URL}/api/analytics/history/accounts/metrics`,
    ({ request }) => {
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      const snsType = url.searchParams.get("snsType");

      if (!date || !snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "date와 snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.AccountMetricsResponse",
          accountId: 123,
          followers: 43300, // 어제 팔로워 수 (실시간보다 적음)
          views: 13726084, // 어제 총 조회 수
          fetchedAt: `${date}T12:00:00`,
          snsType: snsType.toUpperCase(),
        },
      });
    }
  ),

  // 히스토리 게시물 메트릭 조회
  http.get(
    `${API_BASE_URL}/api/analytics/history/posts/metrics`,
    ({ request }) => {
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      const snsType = url.searchParams.get("snsType");
      const postId = url.searchParams.get("postId");

      if (!date || !snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "date와 snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      // 어제 데이터는 실시간 데이터보다 약간 적게
      const yesterdayData = {
        1: { views: 115172, likes: 6026, comments: 198, shares: 48 },
        2: { views: 85000, likes: 3200, comments: 210, shares: 28 },
        3: { views: 21000, likes: 1100, comments: 75, shares: 12 },
        4: { views: 31000, likes: 1700, comments: 140, shares: 22 },
        5: { views: 62000, likes: 2700, comments: 240, shares: 35 },
      };

      const data = postId
        ? yesterdayData[postId] || {
            views: 13500,
            likes: 720,
            comments: 105,
            shares: 18,
          }
        : yesterdayData[1]; // postId가 없으면 첫 번째 게시물 데이터

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostMetricsResponse",
          postId: postId ? parseInt(postId) : 1,
          accountId: 123,
          likes: data.likes,
          dislikes: 8,
          comments: data.comments,
          shares: data.shares,
          views: data.views,
          fetchedAt: `${date}T12:00:00`,
          snsType: snsType.toUpperCase(),
        },
      });
    }
  ),

  // 히스토리 게시물 댓글 조회
  http.get(
    `${API_BASE_URL}/api/analytics/history/posts/comments`,
    ({ request }) => {
      const url = new URL(request.url);
      const snsType = url.searchParams.get("snsType");
      const postId = url.searchParams.get("postId");
      const page = parseInt(url.searchParams.get("page")) || 0;
      const size = parseInt(url.searchParams.get("size")) || 20;

      if (!snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      const comments = [
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_1`,
          authorId: "user123456789",
          text: "어제 갔는데 정말 맛있었어요! 추천합니다 😊",
          likeCount: 12,
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_2`,
          authorId: "user987654321",
          text: "분위기가 너무 좋아서 오래 앉아있었어요",
          likeCount: 6,
          publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_3`,
          authorId: "user456789123",
          text: "가격이 조금 비싸지만 퀄리티가 좋아요",
          likeCount: 9,
          publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_4`,
          authorId: "user789123456",
          text: "직원분들이 친절하시네요 👍",
          likeCount: 4,
          publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        },
        {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.PostCommentsResponse",
          commentId: `UgzDE8pqJ_c_${postId || "1"}_${page}_5`,
          authorId: "user321654987",
          text: "다음에 친구들이랑 같이 가려고 해요!",
          likeCount: 7,
          publishedAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
        },
      ].slice(0, Math.min(size, 5));

      return HttpResponse.json({
        isSuccess: true,
        message: "히스토리 댓글 조회 성공",
        result: comments,
      });
    }
  ),

  // 히스토리 게시물 감정분석 조회
  http.get(
    `${API_BASE_URL}/api/analytics/history/posts/emotion-analysis`,
    ({ request }) => {
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      const snsType = url.searchParams.get("snsType");
      const postId = url.searchParams.get("postId");

      if (!date || !snsType) {
        return HttpResponse.json(
          {
            isSuccess: false,
            message: "date와 snsType 파라미터가 필요합니다.",
            result: null,
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          "@class":
            "kt.aivle.analytics.adapter.in.web.dto.response.EmotionAnalysisResponse",
          postId: postId ? parseInt(postId) : 1,
          emotionSummary: {
            "@class":
              "kt.aivle.analytics.adapter.in.web.dto.response.EmotionAnalysisResponse$EmotionSummary",
            positiveCount: 150,
            neutralCount: 30,
            negativeCount: 20,
            totalCount: 200,
          },
          keywords: {
            positive: ["좋아요", "최고", "대박", "맛있어요", "추천"],
            negative: ["별로", "실망", "아쉽다", "비싸다", "불친절"],
          },
        },
      });
    }
  ),

  // ===== 배치 API =====

  // 계정 메트릭 수집
  http.post(`${API_BASE_URL}/api/analytics/batch/accounts/metrics`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "요청이 성공적으로 처리되었습니다.",
      result: {
        operationName: "account metrics collection",
        status: "SUCCESS",
        executedAt: new Date().toISOString(),
        message: "account metrics collection completed successfully",
        processedCount: 3,
        failedCount: 0,
      },
    });
  }),

  // 특정 계정 메트릭 수집
  http.post(
    `${API_BASE_URL}/api/analytics/batch/accounts/:accountId/metrics`,
    ({ params }) => {
      const accountId = params.accountId;

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          operationName: `account ${accountId} metrics collection`,
          status: "SUCCESS",
          executedAt: new Date().toISOString(),
          message: `account ${accountId} metrics collection completed successfully`,
          processedCount: 1,
          failedCount: 0,
        },
      });
    }
  ),

  // 게시물 메트릭 수집
  http.post(`${API_BASE_URL}/api/analytics/batch/posts/metrics`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: "요청이 성공적으로 처리되었습니다.",
      result: {
        operationName: "post metrics collection",
        status: "SUCCESS",
        executedAt: new Date().toISOString(),
        message: "post metrics collection completed successfully",
        processedCount: 15,
        failedCount: 0,
      },
    });
  }),

  // 특정 게시물 메트릭 수집
  http.post(
    `${API_BASE_URL}/api/analytics/batch/posts/:postId/metrics`,
    ({ params }) => {
      const postId = params.postId;

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          operationName: `post ${postId} metrics collection`,
          status: "SUCCESS",
          executedAt: new Date().toISOString(),
          message: `post ${postId} metrics collection completed successfully`,
          processedCount: 1,
          failedCount: 0,
        },
      });
    }
  ),

  // 배치 작업 상태 조회
  http.get(
    `${API_BASE_URL}/api/analytics/batch/status/:jobName`,
    ({ params }) => {
      const jobName = params.jobName;

      return HttpResponse.json({
        isSuccess: true,
        message: "요청이 성공적으로 처리되었습니다.",
        result: {
          jobName: jobName,
          status: "COMPLETED",
          startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          endTime: new Date().toISOString(),
          progress: 100,
          totalItems: 15,
          errorMessage: null,
        },
      });
    }
  ),

  // 대시보드 통계 (기존 호환성)
  http.get(`${API_BASE_URL}/api/analytics/dashboard`, ({ request }) => {
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "last7";

    const stats = [
      {
        type: "views",
        value: Math.floor(Math.random() * 50000) + 10000,
        change: "+12.5%",
      },
      {
        type: "likes",
        value: Math.floor(Math.random() * 2000) + 500,
        change: "+8.3%",
      },
      {
        type: "comments",
        value: Math.floor(Math.random() * 500) + 100,
        change: "+15.2%",
      },
      {
        type: "shares",
        value: Math.floor(Math.random() * 200) + 50,
        change: "+5.7%",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "대시보드 통계 조회 성공",
      result: stats,
    });
  }),

  // 대시보드 통계 (새로운 엔드포인트)
  http.get(`${API_BASE_URL}/api/analytics/dashboard-stats`, ({ request }) => {
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "last7";

    const stats = [
      {
        type: "views",
        value: Math.floor(Math.random() * 50000) + 10000,
        change: "+12.5%",
      },
      {
        type: "likes",
        value: Math.floor(Math.random() * 2000) + 500,
        change: "+8.3%",
      },
      {
        type: "comments",
        value: Math.floor(Math.random() * 500) + 100,
        change: "+15.2%",
      },
      {
        type: "shares",
        value: Math.floor(Math.random() * 200) + 50,
        change: "+5.7%",
      },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "대시보드 통계 조회 성공",
      result: stats,
    });
  }),

  // 콘텐츠 성과 분석
  http.get(
    `${API_BASE_URL}/api/analytics/content-performance`,
    ({ request }) => {
      const url = new URL(request.url);
      const dateRange = url.searchParams.get("dateRange") || "last7";

      const performance = [
        {
          id: 1,
          title: "여름 특별 메뉴 출시! 🍹",
          platform: "instagram",
          thumbnail:
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
          views: 45678,
          likes: 2345,
          comments: 189,
          shares: 67,
        },
        {
          id: 2,
          title: "카페 인테리어 투어 - 히든 스팟 공개",
          platform: "youtube",
          thumbnail:
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop",
          views: 89234,
          likes: 3456,
          comments: 234,
          shares: 123,
        },
        {
          id: 3,
          title: "오늘의 추천 디저트 🍰",
          platform: "facebook",
          thumbnail:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop",
          views: 23456,
          likes: 1234,
          comments: 89,
          shares: 45,
        },
        {
          id: 4,
          title: "바리스타 추천 커피 레시피",
          platform: "instagram",
          thumbnail:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop",
          views: 34567,
          likes: 1890,
          comments: 156,
          shares: 78,
        },
        {
          id: 5,
          title: "주말 브런치 메뉴 소개",
          platform: "youtube",
          thumbnail:
            "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop",
          views: 67890,
          likes: 2987,
          comments: 267,
          shares: 134,
        },
      ];

      return HttpResponse.json({
        isSuccess: true,
        message: "콘텐츠 성과 분석 조회 성공",
        result: performance,
      });
    }
  ),

  // 댓글 감성 분석
  http.get(`${API_BASE_URL}/api/analytics/comment-sentiment`, ({ request }) => {
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "last7";

    const sentiment = [
      { sentiment: "positive", count: 156, percentage: 68 },
      { sentiment: "neutral", count: 52, percentage: 23 },
      { sentiment: "negative", count: 21, percentage: 9 },
    ];

    return HttpResponse.json({
      isSuccess: true,
      message: "댓글 감성 분석 조회 성공",
      result: sentiment,
    });
  }),

  // 팔로워 트렌드
  http.get(`${API_BASE_URL}/api/analytics/follower-trend`, ({ request }) => {
    const url = new URL(request.url);
    const dateRange = url.searchParams.get("dateRange") || "last7";

    const trend = {
      totalFollowers: 3247,
      newFollowers: 187,
      unfollowers: 23,
      netGrowth: 164,
      weeklyData: [45, 52, 38, 67, 89, 124, 156],
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "팔로워 트렌드 조회 성공",
      result: trend,
    });
  }),

  // 최적 게시 시간
  http.get(`${API_BASE_URL}/api/analytics/optimal-posting-time`, () => {
    const optimalTime = {
      instagram: {
        bestTimes: ["18:00-20:00", "12:00-14:00", "21:00-23:00"],
        engagementRate: 0.85,
      },
      facebook: {
        bestTimes: ["10:00-12:00", "15:00-17:00", "19:00-21:00"],
        engagementRate: 0.72,
      },
      youtube: {
        bestTimes: ["19:00-21:00", "14:00-16:00", "20:00-22:00"],
        engagementRate: 0.91,
      },
      recommendation:
        "다음 콘텐츠는 월요일 오후 6시에 게시하는 것이 가장 효과적입니다. 평균 참여율이 15% 높아집니다.",
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "최적 게시 시간 조회 성공",
      result: optimalTime,
    });
  }),

  // 키워드 분석
  http.get(`${API_BASE_URL}/api/analytics/keyword-analysis`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") || "";

    const analysis = {
      keyword: keyword || "카페",
      frequency: Math.floor(Math.random() * 100) + 20,
      sentiment: ["positive", "neutral", "negative"][
        Math.floor(Math.random() * 3)
      ],
      relatedKeywords: ["커피", "디저트", "분위기", "맛집", "추천"],
      trend: "increasing",
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "키워드 분석 조회 성공",
      result: analysis,
    });
  }),

  // ===== 새로운 Analytics API =====

  // 실시간 계정 메트릭 조회
  http.get(`${API_BASE_URL}/api/analytics/realtime/accounts/metrics`, ({ request }) => {
    const url = new URL(request.url);
    const snsType = url.searchParams.get("snsType") || "youtube";

    const accountMetrics = {
      accountId: 123,
      followers: 10000 + Math.floor(Math.random() * 1000),
      views: 500000 + Math.floor(Math.random() * 50000),
      fetchedAt: new Date().toISOString(),
      snsType: snsType
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "실시간 계정 메트릭 조회 성공",
      result: accountMetrics,
    });
  }),

  // 실시간 게시물 메트릭 조회
  http.get(`${API_BASE_URL}/api/analytics/realtime/posts/metrics`, ({ request }) => {
    const url = new URL(request.url);
    const snsType = url.searchParams.get("snsType") || "youtube";
    const postId = url.searchParams.get("postId");

    const postMetrics = {
      postId: postId ? parseInt(postId) : 456,
      accountId: 123,
      likes: 1500 + Math.floor(Math.random() * 200),
      dislikes: 10 + Math.floor(Math.random() * 5),
      comments: 200 + Math.floor(Math.random() * 50),
      shares: 50 + Math.floor(Math.random() * 20),
      views: 25000 + Math.floor(Math.random() * 5000),
      fetchedAt: new Date().toISOString(),
      snsType: snsType
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "실시간 게시물 메트릭 조회 성공",
      result: postMetrics,
    });
  }),

  // 실시간 게시물 댓글 조회
  http.get(`${API_BASE_URL}/api/analytics/realtime/posts/comments`, ({ request }) => {
    const url = new URL(request.url);
    const snsType = url.searchParams.get("snsType") || "youtube";
    const postId = url.searchParams.get("postId");
    const page = parseInt(url.searchParams.get("page")) || 0;
    const size = parseInt(url.searchParams.get("size")) || 20;

    const comments = Array.from({ length: size }, (_, i) => ({
      commentId: `comment_${page * size + i + 1}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      text: `정말 좋은 영상이네요! ${i + 1}`,
      likeCount: Math.floor(Math.random() * 50),
      publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));

    return HttpResponse.json({
      isSuccess: true,
      message: "실시간 게시물 댓글 조회 성공",
      result: comments,
    });
  }),

  // 히스토리 계정 메트릭 조회
  http.get(`${API_BASE_URL}/api/analytics/history/accounts/metrics`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const snsType = url.searchParams.get("snsType") || "youtube";

    const accountMetrics = {
      accountId: 123,
      followers: 9500 + Math.floor(Math.random() * 1000),
      views: 480000 + Math.floor(Math.random() * 50000),
      fetchedAt: `${date}T10:30:00`,
      snsType: snsType
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "히스토리 계정 메트릭 조회 성공",
      result: accountMetrics,
    });
  }),

  // 히스토리 게시물 메트릭 조회
  http.get(`${API_BASE_URL}/api/analytics/history/posts/metrics`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const snsType = url.searchParams.get("snsType") || "youtube";
    const postId = url.searchParams.get("postId");

    const postMetrics = {
      postId: postId ? parseInt(postId) : 456,
      accountId: 123,
      likes: 1400 + Math.floor(Math.random() * 200),
      dislikes: 8 + Math.floor(Math.random() * 5),
      comments: 180 + Math.floor(Math.random() * 50),
      shares: 45 + Math.floor(Math.random() * 20),
      views: 23000 + Math.floor(Math.random() * 5000),
      fetchedAt: `${date}T10:30:00`,
      snsType: snsType
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "히스토리 게시물 메트릭 조회 성공",
      result: postMetrics,
    });
  }),

  // 히스토리 게시물 댓글 조회
  http.get(`${API_BASE_URL}/api/analytics/history/posts/comments`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const snsType = url.searchParams.get("snsType") || "youtube";
    const postId = url.searchParams.get("postId");
    const page = parseInt(url.searchParams.get("page")) || 0;
    const size = parseInt(url.searchParams.get("size")) || 20;

    const comments = Array.from({ length: size }, (_, i) => ({
      commentId: `comment_${page * size + i + 1}`,
      authorId: `user_${Math.floor(Math.random() * 1000)}`,
      text: `히스토리 댓글 ${i + 1}`,
      likeCount: Math.floor(Math.random() * 50),
      publishedAt: `${date}T${10 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60)}:00`
    }));

    return HttpResponse.json({
      isSuccess: true,
      message: "히스토리 게시물 댓글 조회 성공",
      result: comments,
    });
  }),

  // 히스토리 게시물 감정분석 조회
  http.get(`${API_BASE_URL}/api/analytics/history/posts/emotion-analysis`, ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const snsType = url.searchParams.get("snsType") || "youtube";
    const postId = url.searchParams.get("postId");

    const emotionAnalysis = {
      postId: postId ? parseInt(postId) : 456,
      emotionSummary: {
        positiveCount: 150 + Math.floor(Math.random() * 50),
        neutralCount: 30 + Math.floor(Math.random() * 20),
        negativeCount: 20 + Math.floor(Math.random() * 15),
        totalCount: 200 + Math.floor(Math.random() * 50)
      },
      keywords: {
        positive: ["좋아요", "최고", "대박", "훌륭", "추천"],
        negative: ["별로", "실망", "아쉽다", "부족", "개선"]
      }
    };

    return HttpResponse.json({
      isSuccess: true,
      message: "히스토리 게시물 감정분석 조회 성공",
      result: emotionAnalysis,
    });
  }),
];
