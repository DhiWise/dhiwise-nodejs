import storage from 'redux-persist/lib/storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import rootReducer from './reducers';

const persistConfig = {
  key: 'dhiWise',
  version: 1,
  storage,
};

const persistedReducer = persistReducer({ ...persistConfig }, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),

});
