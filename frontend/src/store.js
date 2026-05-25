import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './modules/health/slice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
  },
});