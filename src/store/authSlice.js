import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {user, token, refreshToken} = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    updateToken: (state, action) => {
      const {token} = action.payload
      state.token = token
      localStorage.setItem('token', token)
    },
  },
})

export const {login, logout, updateToken} = authSlice.actions
export default authSlice.reducer 