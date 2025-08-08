/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gigas': '#3b3c8d',
        'cerulean': '#06aae8',
        'tory-blue': '#0f6fa3',
        'elephant': '#0c2e45',
        'venice-blue': '#0a5081',
        'fun-blue': '#185aac',
        'mariner': '#207ccc',
        'butterfly-bush': '#5c5388',
        'eastern-blue': '#1884a4',
        'lucky-point': '#1c145c',
      }
    },
  },
  plugins: [],
};
