/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#343541',
        'sidebar-bg': '#202123',
        'message-user': '#4a9eff',
        'message-bot': '#10a37f',
      }
    },
  },
  plugins: [],
}
