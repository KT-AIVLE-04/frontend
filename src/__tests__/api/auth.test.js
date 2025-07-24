import { authApi } from '../../api/auth'

describe('authApi (실제 axios, MSW)', () => {
  it('register: 정상 응답', async () => {
    const data = { loginId: 'a@a.com', password: 'pw' }
    const res = await authApi.register(data)
    expect(res.data).toEqual({
      isSuccess: true,
      message: '회원가입이 완료되었습니다.'
    })
  })

  it('register: 파라미터 누락시 400', async () => {
    const data = { loginId: '', password: '' }
    try {
      await authApi.register(data)
    } catch (err) {
      expect(err.response.status).toBe(400)
      expect(err.response.data.isSuccess).toBe(false)
    }
  })

  it('login: 정상 응답', async () => {
    const data = { loginId: 'a@a.com', password: 'pw' }
    const res = await authApi.login(data)
    expect(res.data.isSuccess).toBe(true)
    expect(res.data.result.accessToken).toBe('mock-access-token')
  })

  it('logout: 정상 응답', async () => {
    const res = await authApi.logout()
    expect(res.data.isSuccess).toBe(true)
    expect(res.data.message).toBe('로그아웃되었습니다.')
  })

  it('refresh: 정상 응답', async () => {
    const res = await authApi.refresh()
    expect(res.data.isSuccess).toBe(true)
    expect(res.data.result.accessToken).toBe('new-mock-access-token')
  })
}) 