import { createSlice } from '@reduxjs/toolkit';

const getRefreshToken = () => {
  // localStorage에서 refreshToken 가져오기
  return localStorage.getItem('refreshToken');
};

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {accessToken, refreshToken} = action.payload
      state.isAuthenticated = true
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.error = null
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.error = null
      localStorage.removeItem('refreshToken')
    },
    updateToken: (state, action) => {
      console.log('updateToken', action.payload)
      const {accessToken} = action.payload
      state.accessToken = accessToken
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const {login, logout, updateToken} = authSlice.actions
export default authSlice.reducer 