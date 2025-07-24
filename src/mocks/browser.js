import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers) 

// 정적 파일들을 MSW에서 제외
worker.events.on('request:start', ({ request }) => {
    const url = new URL(request.url)
  
    // CSS, JS, 이미지 등 정적 파일들 제외
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      return 'passthrough'
    }
  })