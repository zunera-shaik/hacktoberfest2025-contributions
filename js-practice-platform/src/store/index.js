import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import questionsSlice from './slices/questionsSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    questions: questionsSlice,
    theme: themeSlice,
  },
});

export default store;
