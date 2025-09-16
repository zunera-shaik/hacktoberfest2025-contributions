import { createSlice } from '@reduxjs/toolkit'

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  }
  return 'light'
}

const initialState = {
  mode: getInitialTheme(),
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode)
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode)
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
