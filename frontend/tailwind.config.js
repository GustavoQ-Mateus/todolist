export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#173753',
          light: '#1e4a6e',
          muted: '#e8eef3',
        },
      },
      borderRadius: {
        corporate: '4px',
      },
    },
  },
  plugins: [],
}
