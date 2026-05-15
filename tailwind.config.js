/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Vibrant 8-bit palette: deep ink navy, bright cyan, bubblegum pink,
        // and sunny yellow. Keys are kept (`darkest`/`dark`/`light`/`lightest`)
        // so existing class names stay stable; values are remapped.
        gb: {
          darkest: '#1a1240',
          dark: '#1fb8ff',
          light: '#ff4fa3',
          lightest: '#ffe34a',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
};
