import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: '',
  appToken: '',
  email: '',
  usersList: [],
  isLoggedOut: false,
};

const AuthenticationReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAppToken: (state, action) => {
      state.appToken = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    clearStore: () => {
      return initialState;
    },
    clearStoreLogout: () => {
      return {
        ...initialState,
        isLoggedOut: true,
      };
    },
    setLogout: (state, action) => {
      state.isLoggedOut = false;
    },
  },
});

export const { setUser, setToken, setAppToken, setEmail, clearStore, clearStoreLogout, setLogout, setUsersList } =
  AuthenticationReducer.actions;
export default AuthenticationReducer.reducer;
