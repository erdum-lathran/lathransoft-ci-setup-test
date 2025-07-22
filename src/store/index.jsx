import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducer';

let persistor;

export default function configureAppStore(onComplete) {
  const persistConfig = {
    key: 'dmssssss',
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
  };

  // Initialize logger
  const logger = createLogger({
    collapsed: true,
    duration: true,
    diff: false,
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      const middlewares = getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      });
      if (process.env.NODE_ENV === 'development') {
        middlewares.push(logger);
      }
      return middlewares;
    },
  });

  persistor = persistStore(store, null, () => onComplete(store));

  return store;
}

export { persistor };

// Method to purge persisted state (e.g., on logout)
export function purgePersistedState() {
  if (persistor) {
    persistor.purge();
  }
}
