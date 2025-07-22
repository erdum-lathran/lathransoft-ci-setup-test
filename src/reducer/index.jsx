import { combineReducers } from '@reduxjs/toolkit';
import DocumentsReducer from './documents';
import AuthenticationReducer from './auth';
import GeneralReducer from './general';

const rootReducer = combineReducers({
  auth: AuthenticationReducer,
  documents: DocumentsReducer,
  general: GeneralReducer,
});

export default rootReducer;
