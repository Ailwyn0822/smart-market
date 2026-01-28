/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#f4c025',
        'accent-red': '#ff6b6b',
        'accent-blue': '#4ecdc4',
        'accent-purple': '#a78bfa',
        'background-light': '#f8f8f5',
        'background-dark': '#221e10',
        'paper': '#fcfbf8',
        'line': '#06C755',
        'content': '#1c180d',
        'cream': '#fefce8',
        'accent-line': '#06c755',
      },
      fontFamily: {
        sans: ['"Spline Sans"', '"Noto Sans TC"', 'sans-serif'],
        display: ['"Spline Sans"', 'sans-serif'],
      },
      boxShadow: {
        'stitch': '4px 4px 0px rgba(0,0,0,1)',
        'stitch-sm': '2px 2px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // 讓表單樣式更漂亮
    require('@tailwindcss/container-queries'), // 讓容器查詢更方便
  ],
}
