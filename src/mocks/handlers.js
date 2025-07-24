import { http, HttpResponse } from 'msw'

export const handlers = [
  // 회원가입
  http.post('/api/members/new', async ({request}) => {
    const {loginId, password} = await request.json()

    if (!loginId || !password) {
      return HttpResponse.json({
        isSuccess: false,
        message: '아이디와 비밀번호를 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '회원가입이 완료되었습니다.'
    })
  }),

  // 로그인
  http.post('/api/members/login', async ({request}) => {
    const {loginId, password} = await request.json()

    if (!loginId || !password) {
      return HttpResponse.json({
        isSuccess: false,
        message: '아이디와 비밀번호를 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: {
        memberId: 1,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    })
  }),

  // 로그아웃
  http.post('/api/members/logout', () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '로그아웃되었습니다.',
      result: null
    })
  }),

  // 토큰 갱신
  http.post('/api/members/refresh', () => {
    return HttpResponse.json({
      isSuccess: true,
      message: '토큰이 갱신되었습니다.',
      result: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token'
      }
    })
  }),

  // 내 정보 조회
  http.get('/api/members/me', () => {
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

  // 게시글 목록 조회 (페이지네이션)
  http.get('/api/articles', ({request}) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page')) || 1
    const size = parseInt(url.searchParams.get('size')) || 10
    const keyword = url.searchParams.get('keyword') || ''

    // 목 데이터 생성
    const totalItems = 45
    const totalPages = Math.ceil(totalItems / size)
    const startIndex = (page - 1) * size
    const endIndex = Math.min(startIndex + size, totalItems)

    const articles = Array.from({ length: endIndex - startIndex }, (_, i) => ({
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
  http.get('/api/articles/:articleId', ({params}) => {
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
  http.post('/api/articles', async ({request}) => {
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
  http.put('/api/articles/:articleId', async ({params, request}) => {
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
  http.delete('/api/articles/:articleId', ({params}) => {
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
  http.get('/api/stores', () => {
    const stores = [
      {
        id: 1,
        name: '카페 달콤',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        category: '카페/디저트'
      },
      {
        id: 2,
        name: '맛있는 분식',
        address: '서울시 마포구 홍대로 456',
        phone: '02-2345-6789',
        category: '분식'
      },
      {
        id: 3,
        name: '스타일 의류',
        address: '서울시 서초구 반포대로 789',
        phone: '02-3456-7890',
        category: '패션/의류'
      }
    ]

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: stores
    })
  }),

  // 매장 생성
  http.post('/api/stores', async ({request}) => {
    const data = await request.json()
    
    if (!data.name || !data.address) {
      return HttpResponse.json({
        isSuccess: false,
        message: '매장명과 주소를 입력해주세요.',
        result: null
      }, {status: 400})
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '매장이 등록되었습니다.',
      result: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        createdAt: new Date().toISOString()
      }
    })
  }),

  // 매장 수정
  http.put('/api/stores/:storeId', async ({params, request}) => {
    const data = await request.json()
    
    return HttpResponse.json({
      isSuccess: true,
      message: '매장 정보가 수정되었습니다.',
      result: {
        id: params.storeId,
        ...data,
        updatedAt: new Date().toISOString()
      }
    })
  }),

  // 매장 삭제
  http.delete('/api/stores/:storeId', ({params}) => {
    return HttpResponse.json({
      isSuccess: true,
      message: '매장이 삭제되었습니다.',
      result: null
    })
  }),

  // ===== 분석 API =====
  
  // 대시보드 통계
  http.get('/api/analytics/dashboard', ({request}) => {
    const url = new URL(request.url)
    const dateRange = url.searchParams.get('dateRange') || 'last7'
    
    const stats = {
      totalStores: 3,
      totalContents: 12,
      totalPosts: 8,
      totalViews: 1254,
      recentActivities: [
        {
          type: 'content',
          message: '새로운 숏폼 콘텐츠가 생성되었습니다.',
          time: '10분 전'
        },
        {
          type: 'store',
          message: '카페 매장 정보가 업데이트되었습니다.',
          time: '1시간 전'
        },
        {
          type: 'sns',
          message: '인스타그램에 콘텐츠가 게시되었습니다.',
          time: '3시간 전'
        },
        {
          type: 'analytics',
          message: '주간 성과 보고서가 준비되었습니다.',
          time: '1일 전'
        }
      ]
    }

    return HttpResponse.json({
      isSuccess: true,
      message: '성공입니다.',
      result: stats
    })
  }),

  // 콘텐츠 성과 분석
  http.get('/api/analytics/content-performance', () => {
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
  http.get('/api/analytics/comment-sentiment', () => {
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
  http.get('/api/analytics/follower-trend', () => {
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
  http.get('/api/analytics/optimal-posting-time', () => {
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
  http.get('/api/content', ({request}) => {
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
  http.post('/api/content', async ({request}) => {
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
  http.get('/api/content/:contentId/status', ({params}) => {
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
  http.get('/api/content/scenarios', () => {
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
  http.get('/api/sns/accounts', () => {
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
  http.post('/api/sns/accounts/:platform', async ({params, request}) => {
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
  http.get('/api/sns/scheduled-posts', () => {
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
  http.post('/api/sns/scheduled-posts', async ({request}) => {
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
  http.get('/api/sns/suggestions', () => {
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
  http.get('/api/sns/hashtags', ({request}) => {
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
  })
] 