import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeSection: null,
  activeQuestion: null,
  sections: {
    basic: [],
    intermediate: [],
    advanced: [],
    pseudoCode: [],
    interview: []
  }
}

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
      state.activeQuestion = null // Reset active question when changing section
    },
    setActiveQuestion: (state, action) => {
      state.activeQuestion = action.payload
    },
    setSections: (state, action) => {
      state.sections = action.payload
    },
    toggleQuestion: (state, action) => {
      const questionId = action.payload
      // If the same question is clicked, close it
      if (state.activeQuestion === questionId) {
        state.activeQuestion = null
      } else {
        state.activeQuestion = questionId
      }
    }
  },
})

export const { 
  setActiveSection, 
  setActiveQuestion, 
  setSections, 
  toggleQuestion 
} = questionsSlice.actions
export default questionsSlice.reducer
