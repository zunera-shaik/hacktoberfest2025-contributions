import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import questionsReducer from './questionsSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    questions: questionsReducer,
  },
})
