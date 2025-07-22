import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGridView: false,
  isLoading: false,
  showMenu: false,
  isFolder: false,
  folderName: '',
  applications: [],
};

const GeneralReducer = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setIsGridView: (state, action) => {
      state.isGridView = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setReload: (state, action) => {
      state.reload = action.payload;
    },
    setShowMenu: (state, action) => {
      state.showMenu = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setCheckFolder: (state, action) => {
      state.isFolder = action.payload;
    },
    setFolderName: (state, action) => {
      state.folderName = action.payload;
    },
    clearStore: () => {
      return initialState;
    },
  },
});

export const {
  setIsGridView,
  setIsLoading,
  setReload,
  setApplications,
  setShowMenu,
  setCheckFolder,
  setFolderName,
  clearStore
} = GeneralReducer.actions;
export default GeneralReducer.reducer;
