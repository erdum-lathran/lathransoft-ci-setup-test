import { createSlice } from '@reduxjs/toolkit';
import { initialBreadCrumbs } from '../static/Constants';
import { clearStore } from './auth';

const initialState = {
  breadcrumbs: initialBreadCrumbs,
  selectedItems: [],
  documentsList: [],
  uploadsProgressList: [],
};

export const DocumentsReducer = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setDocumentsList: (state, action) => {
      state.documentsList = action.payload;
    },
    setUploadsProgress: (state, action) => {
      state.uploadsProgressList = action.payload;
    },
    clearStoreLogoutDocuments: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(clearStore, () => {
      return initialState;
    });
  },
});

export const {
  setBreadcrumbs,
  setSelectedItems,
  setDocumentsList,
  setUploadsProgress,
  clearStoreLogoutDocuments
} = DocumentsReducer.actions;

export default DocumentsReducer.reducer;
