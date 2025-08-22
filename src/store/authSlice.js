import {createSlice} from '@reduxjs/toolkit';

const getRefreshToken = () => {
  // localStorage에서 refreshToken 가져오기
  return localStorage.getItem('refreshToken');
};

const getSelectedStoreId = () => {
  // localStorage에서 selectedStoreId 가져오기
  return localStorage.getItem('selectedStoreId');
};

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
  selectedStoreId: getSelectedStoreId(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('login', action.payload)
      const {accessToken, refreshToken} = action.payload
      state.isAuthenticated = true
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.selectedStoreId = null
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('selectedStoreId')
    },
    updateToken: (state, action) => {
      console.log('updateToken', action.payload)
      const {accessToken} = action.payload
      const {refreshToken} = action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
      state.isAuthenticated = true
    },
    setSelectedStore: (state, action) => {
      // Store 객체에서 ID만 저장
      const store = action.payload;
      state.selectedStoreId = store ? store.id : null;

      // localStorage에 저장
      if (store) {
        localStorage.setItem('selectedStoreId', store.id.toString());
      } else {
        localStorage.removeItem('selectedStoreId');
      }
    }
  }
})

export const {login, logout, updateToken, setSelectedStore} = authSlice.actions
export default authSlice.reducer 