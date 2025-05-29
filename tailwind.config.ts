import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ink! brand colors
        'ink-purple': {
          DEFAULT: '#6E56CF',
          dark: '#4D3B9E',
          light: '#9E8CFC',
        },
        'ink-pink': {
          DEFAULT: '#E86BDF',
          dark: '#C83CBB',
          light: '#FF9EF5',
        },
        'ink-indigo': {
          DEFAULT: '#3B4FD9',
          dark: '#2A3AA0',
          light: '#6B7EFF',
        },
        'ink-teal': {
          DEFAULT: '#14B8A6',
          dark: '#0F8C7E',
          light: '#5EEAD4',
        },
        // Background colors
        'bg-dark': '#121225',
        'bg-darker': '#0A0A14',
        'bg-light-dark': '#1F1F3B',
      },
      fontFamily: {
        // Custom font families
        'freude': ['var(--font-freude)', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'source-code': ['var(--font-source-code-pro)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(10px)' },
          '50%': { opacity: '0.7', filter: 'blur(15px)' },
        },
      },
      backgroundImage: {
        // Custom gradients
        'ink-gradient-primary': 'linear-gradient(135deg, var(--ink-purple) 0%, var(--ink-indigo) 100%)',
        'ink-gradient-secondary': 'linear-gradient(135deg, var(--ink-purple) 0%, var(--ink-pink) 100%)',
        'ink-gradient-dark': 'linear-gradient(135deg, #1F1F3B 0%, #121225 100%)',
        'ink-gradient-card': 'linear-gradient(135deg, rgba(110, 86, 207, 0.2) 0%, rgba(59, 79, 217, 0.2) 100%)',
      },
      borderRadius: {
        // Curved elements - no straight lines
        'ink-sm': '1rem',
        'ink': '2rem',
        'ink-lg': '3rem',
        'ink-xl': '4rem',
        'ink-2xl': '5rem',
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      boxShadow: {
        'ink': '0 4px 20px -2px rgba(110, 86, 207, 0.25)',
        'ink-lg': '0 10px 30px -3px rgba(110, 86, 207, 0.3)',
        'ink-glow': '0 0 15px rgba(110, 86, 207, 0.5)',
        'pink-glow': '0 0 15px rgba(232, 107, 223, 0.5)',
      },
      dropShadow: {
        'ink': '0 0 8px rgba(110, 86, 207, 0.5)',
        'ink-pink': '0 0 8px rgba(232, 107, 223, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
