import { createSlice } from '@reduxjs/toolkit'

const getRefreshToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

const initialState = {
  token: null,
  refreshToken: getRefreshToken(),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {token, refreshToken} = action.payload
      state.token = token
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout: (state) => {
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('refreshToken')
    },
    updateToken: (state, action) => {
      console.log('updateToken', action.payload)
      const {token} = action.payload
      state.token = token
      state.isAuthenticated = true
    },
  },
})

export const {login, logout, updateToken} = authSlice.actions
export default authSlice.reducer 