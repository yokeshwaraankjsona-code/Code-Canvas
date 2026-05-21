module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#39FF14',
        accent: '#7C3AED'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
