/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F2E',
        'ink-deep': '#070A22',
        nebula: '#6C4FF0',
        aurora: '#3AA6FF',
        comet: '#FF6FA5',
        starlight: '#F7F8FC',
        glass: 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(255,255,255,0.14)'
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'nebula-gradient': 'radial-gradient(circle at 20% 20%, rgba(108,79,240,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(58,166,255,0.25), transparent 40%), radial-gradient(circle at 50% 100%, rgba(255,111,165,0.15), transparent 45%)'
      }
    }
  },
  plugins: []
}
