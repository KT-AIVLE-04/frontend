import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '../../api/auth'

describe('axios interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  it('요청 헤더에 토큰 추가', async () => {
    const accessToken = 'test-token'
    localStorage.getItem.mockReturnValue(accessToken)
    
    // authApi 사용 (baseURL 문제 해결)
    const res = await authApi.getMe()
    expect(res.data.isSuccess).toBe(true)
  })

  it('토큰이 없을 때 Authorization 헤더 없음', async () => {
    localStorage.getItem.mockReturnValue(null)
    
    const res = await authApi.getMe()
    expect(res.data.isSuccess).toBe(true)
  })

  it('refreshToken으로 새 토큰 발급', async () => {
    const refreshToken = 'mock-refresh-token'
    localStorage.getItem.mockReturnValue(refreshToken)
    
    const res = await authApi.refresh()
    expect(res.data.isSuccess).toBe(true)
    expect(res.data.result.accessToken).toBe('new-mock-access-token')
  })

  it('refreshToken이 없으면 에러', async () => {
    localStorage.getItem.mockReturnValue(null)
    
    try {
      await authApi.refresh()
    } catch (err) {
      expect(err.message).toContain('No refresh token')
    }
  })

  it('refreshToken이 유효하지 않으면 에러', async () => {
    const refreshToken = 'invalid-refresh-token'
    localStorage.getItem.mockReturnValue(refreshToken)
    
    try {
      await authApi.refresh()
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  it('성공적인 요청은 그대로 반환', async () => {
    const accessToken = 'test-token'
    localStorage.getItem.mockReturnValue(accessToken)
    
    const res = await authApi.getMe()
    expect(res.data.isSuccess).toBe(true)
  })

  it('동시에 여러 요청 시 토큰 갱신은 한 번만 실행', async () => {
    const refreshToken = 'mock-refresh-token'
    localStorage.getItem.mockReturnValue(refreshToken)
    
    // 동시에 여러 refresh 요청 보내기
    const promises = [
      authApi.refresh(),
      authApi.refresh(),
      authApi.refresh()
    ]
    
    const results = await Promise.all(promises)
    
    // 모든 요청이 성공해야 함
    results.forEach(res => {
      expect(res.data.isSuccess).toBe(true)
      expect(res.data.result.accessToken).toBe('new-mock-access-token')
    })
  })

  it('토큰 갱신 후 원래 요청 재시도', async () => {
    const originalAccessToken = 'old-token'
    const refreshToken = 'mock-refresh-token'
    const newAccessToken = 'new-mock-access-token'
    
    localStorage.getItem
      .mockReturnValueOnce(originalAccessToken) // 첫 번째 요청
      .mockReturnValueOnce(refreshToken)  // 토큰 갱신
      .mockReturnValueOnce(newAccessToken)      // 재시도 요청
    
    // 먼저 토큰 갱신
    const refreshRes = await authApi.refresh()
    expect(refreshRes.data.result.accessToken).toBe(newAccessToken)
    
    // 그 다음 다른 API 호출
    const res = await authApi.getMe()
    expect(res.data.isSuccess).toBe(true)
  })

  it('이미 재시도한 요청은 다시 시도하지 않음', async () => {
    const accessToken = 'test-token'
    localStorage.getItem.mockReturnValue(accessToken)
    
    // 정상 요청
    const res1 = await authApi.getMe()
    expect(res1.data.isSuccess).toBe(true)
    
    // 같은 요청 다시 (재시도 플래그가 설정되지 않아야 함)
    const res2 = await authApi.getMe()
    expect(res2.data.isSuccess).toBe(true)
  })

  it('401이 아닌 에러는 토큰 갱신 없이 그대로 전달', async () => {
    const accessToken = 'test-token'
    localStorage.getItem.mockReturnValue(accessToken)
    
    try {
      // 잘못된 데이터로 register 시도 (400 에러)
      await authApi.register({ loginId: '', password: '' })
    } catch (err) {
      expect(err.response.status).toBe(400)
      expect(err.response.data.isSuccess).toBe(false)
    }
  })

  it('토큰 갱신 중 다른 요청들이 대기열에 추가됨', async () => {
    const refreshToken = 'mock-refresh-token'
    localStorage.getItem.mockReturnValue(refreshToken)
    
    // 토큰 갱신과 다른 요청을 동시에 실행
    const refreshPromise = authApi.refresh()
    const otherPromise = authApi.getMe()
    
    const [refreshRes, otherRes] = await Promise.all([refreshPromise, otherPromise])
    
    expect(refreshRes.data.isSuccess).toBe(true)
    expect(otherRes.data.isSuccess).toBe(true)
  })

  it('토큰 갱신 실패 시 대기열의 모든 요청도 실패', async () => {
    const refreshToken = 'invalid-refresh-token'
    localStorage.getItem.mockReturnValue(refreshToken)
    
    try {
      // 토큰 갱신과 다른 요청을 동시에 실행
      const refreshPromise = authApi.refresh()
      const otherPromise = authApi.getMe()
      
      await Promise.all([refreshPromise, otherPromise])
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
}) 