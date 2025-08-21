import { http, HttpResponse, passthrough } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

export const handlers = [
  // // 전역 딜레이 미들웨어
  // http.all('*', async () => {
  //   await delay(2000);
  // }),
  // 모든 HTTP 메서드에 대해 passthrough 조건 적용
  http.all('*', ({request}) => {
    const url = new URL(request.url);
    const workingEndpoints = [
      '/api/auth',
      '/api/stores',
      '/api/shorts',
      '/api/contents',
      // '/api/analytics',
    ]

    // msw 작동 안하는 조건들
    const isStaticFile = /\.(css|js|png|jpg|svg|ico|woff|woff2|ttf|eot)$/.test(url.pathname);
    const isNotHost = url.origin !== API_BASE_URL;
    const isWorkingEndpoint = workingEndpoints.some(endpoint =>
      url.pathname.includes(endpoint)
    )
    const isLocalHost = url.origin === "http://localhost:8080"
    if (isStaticFile || isNotHost || isWorkingEndpoint || isLocalHost) {
      console.log("🛳️ passthrough", url.pathname, {
        isStaticFile,
        isNotHost,
        isWorkingEndpoint,
        isLocalHost
      })
      return passthrough()
    }
    console.log("🍪 MSW", url.pathname)
  }),
  http.post(`${API_BASE_URL}/api/auth/new`, async ({request}) => {
    const {email, password, name, phoneNumber} = await request.json()

    if (!email || !password || !name || !phoneNumber) {
      return HttpResponse.json({
        isSuccess: false,
        message: '모든 필드를 입력해주세요.',
        result: null,
        errors: [
          {
            field: 'email',
            message: '이메일을 입력해주세요.'
          }
        ]
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '회원가입이 완료되었습니다.',
      result: {
        type: 'USER',
        accessToken: 'mock-access-token',
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: 'mock-refresh-token',
        refreshTokenExpiration: Date.now() + 2592000000 // 30일
      },
      errors: []
    })
  }),

  // 로그인
  http.post(`${API_BASE_URL}/api/auth/login`, async ({request}) => {
    const {email, password} = await request.json()

    if (!email || !password) {
      return HttpResponse.json({
        isSuccess: false,
        message: '아이디와 비밀번호를 입력해주세요.',
        result: null,
        errors: [
          {
            field: 'email',
            message: '이메일을 입력해주세요.'
          }
        ]
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        type: 'USER',
        accessToken: 'mock-access-token',
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: 'mock-refresh-token',
        refreshTokenExpiration: Date.now() + 2592000000 // 30일
      },
      errors: []
    })
  }),

  // 로그아웃
  http.post(`${API_BASE_URL}/api/auth/logout`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '로그아웃되었습니다.',
      result: '로그아웃 성공',
      errors: []
    })
  }),

  // 토큰 갱신
  http.post(`${API_BASE_URL}/api/auth/refresh`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '토큰이 갱신되었습니다.',
      result: {
        type: 'USER',
        accessToken: 'new-mock-access-token',
        accessTokenExpiration: Date.now() + 3600000, // 1시간
        refreshToken: 'new-mock-refresh-token',
        refreshTokenExpiration: Date.now() + 2592000000 // 30일
      },
      errors: []
    })
  }),

  // 내 정보 조회
  http.get(`${API_BASE_URL}/api/auth/me`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        memberId: 1,
        loginId: 'test@test.com',
        name: '테스트 사용자'
      }
    })
  }),

  // OAuth2 구글 로그인
  http.get(`${API_BASE_URL}/api/oauth2/authorization/google`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '구글 로그인 리다이렉트',
      result: {
        redirectUrl: 'https://accounts.google.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/auth/google/callback'
      }
    })
  }),

  // OAuth2 카카오 로그인
  http.get(`${API_BASE_URL}/api/oauth2/authorization/kakao`, () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '카카오 로그인 리다이렉트',
      result: {
        redirectUrl: 'https://kauth.kakao.com/oauth/authorize?client_id=mock&redirect_uri=http://localhost:3000/auth/kakao/callback'
      }
    })
  }),

  // 게시글 목록 조회 (페이지네이션)
  http.get(`${API_BASE_URL}/api/articles`, ({request}) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page')) || 1
    const size = parseInt(url.searchParams.get('size')) || 10
    const keyword = url.searchParams.get('keyword') || ''

    // 목 데이터 생성
    const totalItems = 45
    const totalPages = Math.ceil(totalItems / size)
    const startIndex = (page - 1) * size
    const endIndex = Math.min(startIndex + size, totalItems)

    const articles = Array.from({length: endIndex - startIndex}, (_, i) => ({
      articleId: startIndex + i + 1,
      title: `게시글 제목 ${startIndex + i + 1}${keyword ? ` - ${keyword}` : ''}`,
      content: `게시글 내용 ${startIndex + i + 1}입니다.`,
      author: `작성자${startIndex + i + 1}`,
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }))

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        articles,
        pagination: {
          page,
          size,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      }
    })
  }),

  // 게시글 상세 조회
  http.get(`${API_BASE_URL}/api/articles/:articleId`, ({params}) => {
    if (!params.articleId) {
      return HttpResponse.json({
        isSuccess: false,
        message: '게시글 ID가 필요합니다.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        articleId: params.articleId,
        title: `게시글 제목 ${params.articleId}`,
        content: `이것은 게시글 ${params.articleId}의 상세 내용입니다. 여러 줄의 텍스트가 들어갈 수 있습니다.`,
        author: `작성자${params.articleId}`,
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        createdAt: '2025-01-15T10:30:00',
        updatedAt: '2025-01-16T14:20:00',
        comments: [
          {
            commentId: 1,
            content: '첫 번째 댓글입니다.',
            author: '댓글작성자1',
            createdAt: '2025-01-15T11:00:00'
          },
          {
            commentId: 2,
            content: '두 번째 댓글입니다.',
            author: '댓글작성자2',
            createdAt: '2025-01-15T12:30:00'
          }
        ]
      }
    })
  }),

  // 게시글 생성
  http.post(`${API_BASE_URL}/api/articles`, async ({request}) => {
    const data = await request.json()

    if (!data.title || !data.content) {
      return HttpResponse.json({
        isSuccess: false,
        message: '제목과 내용을 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '게시글이 생성되었습니다.',
      result: {
        articleId: Math.floor(Math.random() * 1000) + 100,
        ...data,
        author: '현재사용자',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
  }),

  // 게시글 수정
  http.put(`${API_BASE_URL}/api/articles/:articleId`, async ({params, request}) => {
    if (!params.articleId) {
      return HttpResponse.json({
        isSuccess: false,
        message: '게시글 ID가 필요합니다.',
        result: null
      }, {status: 400})
    }

    const data = await request.json()
    if (!data.title || !data.content) {
      return HttpResponse.json({
        isSuccess: false,
        message: '제목과 내용을 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '게시글이 수정되었습니다.',
      result: {
        articleId: params.articleId,
        ...data,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  // 게시글 삭제
  http.delete(`${API_BASE_URL}/api/articles/:articleId`, ({params}) => {
    if (!params.articleId) {
      return HttpResponse.json({
        isSuccess: false,
        message: '게시글 ID가 필요합니다.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '게시글이 삭제되었습니다.',
      result: null
    })
  }),

  // ===== 매장 관리 API =====

  // 매장 목록 조회
  http.get(`${API_BASE_URL}/api/stores`, () => {
    const stores = [
      {
        id: 1,
        userId: 1,
        name: '카페 달콤',
        address: '서울시 강남구 테헤란로 123',
        phoneNumber: '02-1234-5678',
        businessNumber: '123-45-67890',
        latitude: 37.5665,
        longitude: 126.9780,
        industry: 'FOOD'
      },
      {
        id: 2,
        userId: 1,
        name: '맛있는 분식',
        address: '서울시 마포구 홍대로 456',
        phoneNumber: '02-2345-6789',
        businessNumber: '234-56-78901',
        latitude: 37.5565,
        longitude: 126.9280,
        industry: 'FOOD'
      },
      {
        id: 3,
        userId: 1,
        name: '스타일 의류',
        address: '서울시 서초구 반포대로 789',
        phoneNumber: '02-3456-7890',
        businessNumber: '345-67-89012',
        latitude: 37.5465,
        longitude: 126.9180,
        industry: 'RETAIL'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: stores
    })
  }),

  // 매장 생성
  http.post(`${API_BASE_URL}/api/stores`, async ({request}) => {
    const data = await request.json()

    if (!data.name || !data.address || !data.phoneNumber || !data.industry) {
      return HttpResponse.json({
        isSuccess: false,
        message: '매장명, 주소, 연락처, 업종을 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '매장이 등록되었습니다.',
      result: {
        id: Math.floor(Math.random() * 1000) + 100,
        userId: 1,
        ...data,
        createdAt: new Date().toISOString()
      }
    })
  }),

  // 매장 수정 (PATCH 사용)
  http.patch(`${API_BASE_URL}/api/stores/:storeId`, async ({params, request}) => {
    const data = await request.json()

    return HttpResponse.json({
      isSuccess: true,
      message: '매장 정보가 수정되었습니다.',
      result: {
        id: params.storeId,
        userId: 1,
        ...data,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  // 매장 삭제
  http.delete(`${API_BASE_URL}/api/stores/:storeId`, ({params}) => {
    return HttpResponse.json({
      isSuccess: true,
      message: '매장이 삭제되었습니다.',
      result: null
    })
  }),

  // ===== 분석 API =====

  // 대시보드 통계
  http.get(`${API_BASE_URL}/api/analytics/dashboard`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const stats = [
      {
        type: 'views',
        value: 1254,
        change: '+12.5%'
      },
      {
        type: 'likes',
        value: 342,
        change: '+8.3%'
      },
      {
        type: 'comments',
        value: 87,
        change: '+15.2%'
      },
      {
        type: 'shares',
        value: 54,
        change: '+5.7%'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: stats
    })
  }),

  // 콘텐츠 성과 분석
  http.get(`${API_BASE_URL}/api/analytics/content-performance`, () => {
    const performance = [
      {
        id: 1,
        title: '카페 달콤 신메뉴 소개',
        views: 2456,
        likes: 342,
        comments: 87,
        shares: 54,
        platform: 'instagram'
      },
      {
        id: 2,
        title: '여름 신상품 컬렉션',
        views: 1845,
        likes: 256,
        comments: 62,
        shares: 38,
        platform: 'facebook'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: performance
    })
  }),

  // 댓글 감성 분석
  http.get(`${API_BASE_URL}/api/analytics/comment-sentiment`, () => {
    const sentiment = [
      {
        sentiment: 'positive',
        count: 245,
        percentage: 65
      },
      {
        sentiment: 'neutral',
        count: 87,
        percentage: 23
      },
      {
        sentiment: 'negative',
        count: 45,
        percentage: 12
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: sentiment
    })
  }),

  // 팔로워 트렌드
  http.get(`${API_BASE_URL}/api/analytics/follower-trend`, () => {
    const trend = {
      totalFollowers: 2145,
      newFollowers: 156,
      unfollowers: 32,
      netGrowth: 124,
      weeklyData: [35, 42, 38, 45, 40, 48, 52]
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: trend
    })
  }),

  // 최적 게시 시간
  http.get(`${API_BASE_URL}/api/analytics/optimal-posting-time`, () => {
    const optimalTimes = {
      instagram: ['18-20시', '12-14시', '21-23시'],
      facebook: ['10-12시', '15-17시', '19-21시'],
      recommendation: '월요일 오후 6시'
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: optimalTimes
    })
  }),

  // ===== 콘텐츠 API =====

  // 콘텐츠 목록 조회
  http.get(`${API_BASE_URL}/api/content`, ({request}) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'videos'

    const contents = [
      {
        id: 1,
        title: '카페 달콤 신메뉴 소개',
        type: 'video',
        duration: '00:15',
        createdAt: '2023-06-15',
        views: 245,
        likes: 32,
        store: '카페 달콤'
      },
      {
        id: 2,
        title: '여름 신상품 컬렉션',
        type: 'video',
        duration: '00:22',
        createdAt: '2023-06-10',
        views: 189,
        likes: 24,
        store: '스타일 의류'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: contents
    })
  }),

  // 콘텐츠 생성 (AI)
  http.post(`${API_BASE_URL}/api/content`, async ({request}) => {
    const data = await request.json()

    return HttpResponse.json({
      isSuccess: true,
      message: '콘텐츠 생성이 시작되었습니다.',
      result: {
        contentId: Math.floor(Math.random() * 1000) + 100,
        status: 'processing',
        estimatedTime: '2분'
      }
    })
  }),

  // 콘텐츠 생성 상태 확인
  http.get(`${API_BASE_URL}/api/content/:contentId/status`, ({params}) => {
    const statuses = ['processing', 'completed', 'failed']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        contentId: params.contentId,
        status: randomStatus,
        progress: randomStatus === 'processing' ? Math.floor(Math.random() * 100) : 100
      }
    })
  }),

  // 시나리오 목록 조회
  http.get(`${API_BASE_URL}/api/content/scenarios`, () => {
    const scenarios = [
      {
        id: 1,
        title: '시나리오 1',
        description: '매장 제품을 다양한 각도에서 보여주고, 사용하는 모습을 담은 실용적인 숏폼',
        recommended: true
      },
      {
        id: 2,
        title: '시나리오 2',
        description: '제품의 특징을 강조하며 트렌디한 배경음악과 함께 감성적인 분위기를 연출하는 숏폼',
        recommended: false
      },
      {
        id: 3,
        title: '시나리오 3',
        description: '매장의 특별한 이벤트나 할인 정보를 재미있게 소개하는 홍보 중심의 숏폼',
        recommended: false
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: scenarios
    })
  }),

  // ===== SNS API =====

  // 연동된 SNS 계정 목록
  http.get(`${API_BASE_URL}/api/sns/accounts`, () => {
    const accounts = [
      {
        type: 'instagram',
        name: '@cafe_dalkom',
        connected: true,
        accountName: '카페 달콤',
        followers: '1,245',
        posts: 32
      },
      {
        type: 'facebook',
        name: '맛있는 분식',
        connected: true,
        accountName: '맛있는 분식',
        followers: '856',
        posts: 28
      },
      {
        type: 'youtube',
        name: '스타일 의류',
        connected: false,
        accountName: '',
        followers: '',
        posts: 0
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: accounts
    })
  }),

  // SNS 계정 연결
  http.post(`${API_BASE_URL}/api/sns/accounts/:platform`, async ({params, request}) => {
    const data = await request.json()

    return HttpResponse.json({
      isSuccess: true,
      message: `${params.platform} 계정이 연결되었습니다.`,
      result: {
        platform: params.platform,
        ...data,
        connected: true
      }
    })
  }),

  // 예약 게시물 목록
  http.get(`${API_BASE_URL}/api/sns/scheduled-posts`, () => {
    const posts = [
      {
        id: 1,
        title: '주말 특별 할인 이벤트',
        platform: 'instagram',
        scheduledDate: '2023-06-18 18:00',
        status: 'scheduled'
      },
      {
        id: 2,
        title: '여름 신상품 출시 안내',
        platform: 'facebook',
        scheduledDate: '2023-06-20 12:00',
        status: 'scheduled'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: posts
    })
  }),

  // 예약 게시물 생성
  http.post(`${API_BASE_URL}/api/sns/scheduled-posts`, async ({request}) => {
    const data = await request.json()

    return HttpResponse.json({
      isSuccess: true,
      message: '게시물이 예약되었습니다.',
      result: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        status: 'scheduled'
      }
    })
  }),

  // SNS 최적화 제안
  http.get(`${API_BASE_URL}/api/sns/suggestions`, () => {
    const suggestions = [
      {
        id: 1,
        type: 'hashtag',
        title: '인기 해시태그 추천',
        content: '#여름맞이 #카페추천 #디저트그램 #커피스타그램 #달콤한하루'
      },
      {
        id: 2,
        type: 'timing',
        title: '최적 게시 시간',
        content: '인스타그램: 평일 오후 6-8시, 페이스북: 오전 10-12시'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: suggestions
    })
  }),

  // 해시태그 추천
  http.get(`${API_BASE_URL}/api/sns/hashtags`, ({request}) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') || ''

    const hashtags = [
      '#여름맞이',
      '#카페추천',
      '#디저트그램',
      '#커피스타그램',
      '#달콤한하루'
    ].filter(tag => tag.includes(keyword))

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: hashtags
    })
  }),

  // ===== Analytics API Mocks =====

  // 실시간 게시물 메트릭
  http.get(`${API_BASE_URL}/api/analytics/realtime/posts/:postId/metrics`, ({params}) => {
    const postId = params.postId

    // postId에 따라 다른 데이터 반환
    const metricsData = {
      1: {views: 115374, likes: "6032", comments: 198, shares: null},
      2: {views: 89234, likes: "3456", comments: 234, shares: null},
      3: {views: 23456, likes: "1234", comments: 89, shares: null},
      4: {views: 34567, likes: "1890", comments: 156, shares: null},
      5: {views: 67890, likes: "2987", comments: 267, shares: null}
    };

    const data = metricsData[postId] || {views: 15000, likes: "800", comments: 120, shares: null};

    return HttpResponse.json({
      isSuccess: true,
      message: '요청이 성공적으로 처리되었습니다.',
      result: [{
        postId: parseInt(postId),
        snsPostId: `w7YKHjH_MpM_${postId}`,
        accountId: 1,
        likes: data.likes,
        dislikes: 0,
        comments: data.comments,
        shares: data.shares,
        views: data.views,
        fetchedAt: new Date().toISOString(),
        dataSource: 'youtube_api',
        isCached: false
      }]
    })
  }),

  // 실시간 계정 메트릭
  http.get(`${API_BASE_URL}/api/analytics/realtime/accounts/:accountId/metrics`, ({params}) => {
    const accountId = params.accountId

    return HttpResponse.json({
      isSuccess: true,
      message: '요청이 성공적으로 처리되었습니다.',
      result: [{
        accountId: parseInt(accountId),
        snsAccountId: `UC_BDaOejkuzpT4Jlt_r2vlA`,
        followers: 43400,
        views: 13739858,
        fetchedAt: new Date().toISOString(),
        dataSource: 'youtube_api',
        isCached: false
      }]
    })
  }),

  // 실시간 댓글 조회
  http.get(`${API_BASE_URL}/api/analytics/realtime/posts/:postId/comments`, ({params, request}) => {
    const postId = params.postId
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page')) || 0
    const size = parseInt(url.searchParams.get('size')) || 20

    const comments = [
      {
        commentId: `UgzDE8pqJ_c_${postId}_${page}_1`,
        authorId: 123456789,
        text: '정말 맛있어 보여요! 다음에 꼭 가보고 싶습니다 😋',
        likeCount: 15,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        crawledAt: new Date().toISOString()
      },
      {
        commentId: `UgzDE8pqJ_c_${postId}_${page}_2`,
        authorId: 987654321,
        text: '인테리어가 너무 예쁘네요. 분위기 좋아 보여요!',
        likeCount: 8,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        crawledAt: new Date().toISOString()
      },
      {
        commentId: `UgzDE8pqJ_c_${postId}_${page}_3`,
        authorId: 456789123,
        text: '가격대비 퀄리티가 정말 좋은 것 같아요 👍',
        likeCount: 12,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        crawledAt: new Date().toISOString()
      },
      {
        commentId: `UgzDE8pqJ_c_${postId}_${page}_4`,
        authorId: 789123456,
        text: '주차는 어떻게 되나요?',
        likeCount: 3,
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        crawledAt: new Date().toISOString()
      },
      {
        commentId: `UgzDE8pqJ_c_${postId}_${page}_5`,
        authorId: 321654987,
        text: '사진이 너무 잘 나와요! 카메라 앵글 대박 👏',
        likeCount: 20,
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        crawledAt: new Date().toISOString()
      }
    ].slice(0, Math.min(size, 5))

    return HttpResponse.json({
      isSuccess: true,
      message: '실시간 댓글 조회 성공',
      result: comments
    })
  }),

  // 히스토리 게시물 메트릭
  http.get(`${API_BASE_URL}/api/analytics/history/posts/:postId/metrics`, ({params, request}) => {
    const postId = params.postId
    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    if (!date) {
      return HttpResponse.json({
        isSuccess: false,
        message: '날짜 파라미터가 필요합니다.',
        result: null
      }, {status: 400})
    }

    // 어제 데이터는 실시간 데이터보다 약간 적게
    const yesterdayData = {
      1: {views: 115172, likes: "6026", comments: 198, shares: null},
      2: {views: 85000, likes: "3200", comments: 210, shares: null},
      3: {views: 21000, likes: "1100", comments: 75, shares: null},
      4: {views: 31000, likes: "1700", comments: 140, shares: null},
      5: {views: 62000, likes: "2700", comments: 240, shares: null}
    };

    const data = yesterdayData[postId] || {views: 13500, likes: "720", comments: 105, shares: null};

    return HttpResponse.json({
      isSuccess: true,
      message: '요청이 성공적으로 처리되었습니다.',
      result: [{
        postId: parseInt(postId),
        likes: data.likes,
        dislikes: 0,
        comments: data.comments,
        shares: data.shares,
        views: data.views,
        crawledAt: `${date}T12:00:00`
      }]
    })
  }),

  // 히스토리 계정 메트릭
  http.get(`${API_BASE_URL}/api/analytics/history/accounts/:accountId/metrics`, ({params, request}) => {
    const accountId = params.accountId
    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    if (!date) {
      return HttpResponse.json({
        isSuccess: false,
        message: '날짜 파라미터가 필요합니다.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '요청이 성공적으로 처리되었습니다.',
      result: [{
        accountId: parseInt(accountId),
        followers: 43300, // 어제 팔로워 수 (실시간보다 적음)
        views: 13726084,  // 어제 총 조회 수
        crawledAt: `${date}T12:00:00`
      }]
    })
  }),

  // 히스토리 댓글 조회
  http.get(`${API_BASE_URL}/api/analytics/history/posts/:postId/comments`, ({params, request}) => {
    const postId = params.postId
    const url = new URL(request.url)
    const date = url.searchParams.get('date')
    const page = parseInt(url.searchParams.get('page')) || 0
    const size = parseInt(url.searchParams.get('size')) || 20

    if (!date) {
      return HttpResponse.json({
        isSuccess: false,
        message: '날짜 파라미터가 필요합니다.',
        result: null
      }, {status: 400})
    }

    const comments = [
      {
        commentId: `UgzDE8pqJ_c_${date}_${postId}_1`,
        authorId: 123456789,
        text: '어제 갔는데 정말 맛있었어요! 추천합니다 😊',
        likeCount: 12,
        publishedAt: `${date}T14:30:00`,
        crawledAt: `${date}T12:00:00`
      },
      {
        commentId: `UgzDE8pqJ_c_${date}_${postId}_2`,
        authorId: 987654321,
        text: '분위기가 너무 좋아서 오래 앉아있었어요',
        likeCount: 6,
        publishedAt: `${date}T16:45:00`,
        crawledAt: `${date}T12:00:00`
      },
      {
        commentId: `UgzDE8pqJ_c_${date}_${postId}_3`,
        authorId: 456789123,
        text: '가격이 조금 비싸지만 퀄리티가 좋아요',
        likeCount: 9,
        publishedAt: `${date}T18:20:00`,
        crawledAt: `${date}T12:00:00`
      },
      {
        commentId: `UgzDE8pqJ_c_${date}_${postId}_4`,
        authorId: 789123456,
        text: '직원분들이 친절하시네요 👍',
        likeCount: 4,
        publishedAt: `${date}T20:15:00`,
        crawledAt: `${date}T12:00:00`
      },
      {
        commentId: `UgzDE8pqJ_c_${date}_${postId}_5`,
        authorId: 321654987,
        text: '다음에 친구들이랑 같이 가려고 해요!',
        likeCount: 7,
        publishedAt: `${date}T21:30:00`,
        crawledAt: `${date}T12:00:00`
      }
    ].slice(0, Math.min(size, 5))

    return HttpResponse.json({
      isSuccess: true,
      message: '히스토리 댓글 조회 성공',
      result: comments
    })
  }),

  // 대시보드 통계 (기존 호환성)
  http.get(`${API_BASE_URL}/api/analytics/dashboard`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const stats = [
      {
        type: 'views',
        value: Math.floor(Math.random() * 50000) + 10000,
        change: '+12.5%'
      },
      {
        type: 'likes',
        value: Math.floor(Math.random() * 2000) + 500,
        change: '+8.3%'
      },
      {
        type: 'comments',
        value: Math.floor(Math.random() * 500) + 100,
        change: '+15.2%'
      },
      {
        type: 'shares',
        value: Math.floor(Math.random() * 200) + 50,
        change: '+5.7%'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '대시보드 통계 조회 성공',
      result: stats
    })
  }),

  // 대시보드 통계 (새로운 엔드포인트)
  http.get(`${API_BASE_URL}/api/analytics/dashboard-stats`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const stats = [
      {
        type: 'views',
        value: Math.floor(Math.random() * 50000) + 10000,
        change: '+12.5%'
      },
      {
        type: 'likes',
        value: Math.floor(Math.random() * 2000) + 500,
        change: '+8.3%'
      },
      {
        type: 'comments',
        value: Math.floor(Math.random() * 500) + 100,
        change: '+15.2%'
      },
      {
        type: 'shares',
        value: Math.floor(Math.random() * 200) + 50,
        change: '+5.7%'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '대시보드 통계 조회 성공',
      result: stats
    })
  }),

  // 콘텐츠 성과 분석
  http.get(`${API_BASE_URL}/api/analytics/content-performance`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const performance = [
      {
        id: 1,
        title: '여름 특별 메뉴 출시! 🍹',
        platform: 'instagram',
        thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
        views: 45678,
        likes: 2345,
        comments: 189,
        shares: 67
      },
      {
        id: 2,
        title: '카페 인테리어 투어 - 히든 스팟 공개',
        platform: 'youtube',
        thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
        views: 89234,
        likes: 3456,
        comments: 234,
        shares: 123
      },
      {
        id: 3,
        title: '오늘의 추천 디저트 🍰',
        platform: 'facebook',
        thumbnail: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop',
        views: 23456,
        likes: 1234,
        comments: 89,
        shares: 45
      },
      {
        id: 4,
        title: '바리스타 추천 커피 레시피',
        platform: 'instagram',
        thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
        views: 34567,
        likes: 1890,
        comments: 156,
        shares: 78
      },
      {
        id: 5,
        title: '주말 브런치 메뉴 소개',
        platform: 'youtube',
        thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
        views: 67890,
        likes: 2987,
        comments: 267,
        shares: 134
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '콘텐츠 성과 분석 조회 성공',
      result: performance
    })
  }),

  // 댓글 감성 분석
  http.get(`${API_BASE_URL}/api/analytics/comment-sentiment`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const sentiment = [
      {sentiment: 'positive', count: 156, percentage: 68},
      {sentiment: 'neutral', count: 52, percentage: 23},
      {sentiment: 'negative', count: 21, percentage: 9}
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '댓글 감성 분석 조회 성공',
      result: sentiment
    })
  }),

  // 팔로워 트렌드
  http.get(`${API_BASE_URL}/api/analytics/follower-trend`, ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'

    const trend = {
      totalFollowers: 3247,
      newFollowers: 187,
      unfollowers: 23,
      netGrowth: 164,
      weeklyData: [45, 52, 38, 67, 89, 124, 156]
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '팔로워 트렌드 조회 성공',
      result: trend
    })
  }),

  // 최적 게시 시간
  http.get(`${API_BASE_URL}/api/analytics/optimal-posting-time`, () => {
    const optimalTime = {
      instagram: {
        bestTimes: ['18:00-20:00', '12:00-14:00', '21:00-23:00'],
        engagementRate: 0.85
      },
      facebook: {
        bestTimes: ['10:00-12:00', '15:00-17:00', '19:00-21:00'],
        engagementRate: 0.72
      },
      youtube: {
        bestTimes: ['19:00-21:00', '14:00-16:00', '20:00-22:00'],
        engagementRate: 0.91
      },
      recommendation: '다음 콘텐츠는 월요일 오후 6시에 게시하는 것이 가장 효과적입니다. 평균 참여율이 15% 높아집니다.'
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '최적 게시 시간 조회 성공',
      result: optimalTime
    })
  }),

  // 키워드 분석
  http.get(`${API_BASE_URL}/api/analytics/keyword-analysis`, ({request}) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') || ''

    const analysis = {
      keyword: keyword || '카페',
      frequency: Math.floor(Math.random() * 100) + 20,
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      relatedKeywords: ['커피', '디저트', '분위기', '맛집', '추천'],
      trend: 'increasing'
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '키워드 분석 조회 성공',
      result: analysis
    })
  })
] 