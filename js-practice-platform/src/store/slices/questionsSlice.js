import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  currentQuestion: null,
  filter: {
    category: 'all',
    difficulty: 'all',
  },
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    updateFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
  },
});

export const {
  setQuestions,
  setCurrentQuestion,
  updateFilter,
  setLoading,
  setError,
  addQuestion,
  updateQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
