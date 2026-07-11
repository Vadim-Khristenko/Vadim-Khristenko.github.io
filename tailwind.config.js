/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Oranienbaum', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        win11: ['Segoe UI Variable', 'Segoe UI', 'sans-serif'],
        macos: ['SF Pro Display', '-apple-system', 'sans-serif'],
        win95: ['MS Sans Serif', 'Tahoma', 'sans-serif'],
        macclassic: ['VT323', 'Chicago', 'monospace'],
        vtuber: ['M PLUS Rounded 1c', 'Quicksand', 'sans-serif'],
        terminal: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
