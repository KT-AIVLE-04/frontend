import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers) 

// 조건부 mock 처리
worker.events.on('request:start', ({ request }) => {
    const url = new URL(request.url)
    console.log("url", url)
    // CSS, JS, 이미지 등 정적 파일들 제외
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      return 'passthrough'
    }
    if(url.origin !== 'http://localhost:8080') {
      return 'passthrough'
    }

    // 백엔드에서 잘 되는 부분만 여기에 추가 (실제 백엔드로 통과)
    const workingEndpoints = [
      '/api/auth',  // auth API만 실제 백엔드로
      '/api/stores' // stores API도 실제 백엔드로
    ]

    // 잘 되는 엔드포인트면 실제 백엔드로 통과, 아니면 mock 사용
    const isWorkingEndpoint = workingEndpoints.some(endpoint => 
      url.pathname.includes(endpoint)
    )
    console.log("url.pathname", url.pathname)

    if (isWorkingEndpoint && url.pathname.startsWith('/api/')) {
      return 'passthrough'
    }
    console.log("isWorkingEndpoint", isWorkingEndpoint)
  })