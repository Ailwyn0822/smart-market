/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
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
        'paper-blue': '#e0f2fe',
        'paper-green': '#dcfce7',
        'paper-pink': '#fce7f3',
        'paper-yellow': '#fef9c3',
      },
      fontFamily: {
        sans: ['"Spline Sans"', '"Noto Sans TC"', 'sans-serif'],
        display: ['"Spline Sans"', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        "mono-card": ['"Courier Prime"', 'monospace'],
      },
      boxShadow: {
        'stitch': '4px 4px 0px rgba(0,0,0,1)',
        'stitch-sm': '2px 2px 0px rgba(0,0,0,1)',
        'paper': '2px 4px 12px -2px rgba(0, 0, 0, 0.1)',
        'polaroid': '4px 6px 15px -3px rgba(0, 0, 0, 0.15)',
        'sticker': '0px 4px 0px 0px rgba(180, 140, 0, 1)',
      },
      backgroundImage: {
        'tape': 'linear-gradient(-45deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // 讓表單樣式更漂亮
    require('@tailwindcss/container-queries'), // 讓容器查詢更方便
  ],
}
