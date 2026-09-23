/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bnh: {
          950: '#07090E',
          900: '#0B0F17',
          850: '#101624',
          800: '#161F33',
          700: '#202C47',
          600: '#32446A',
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB',
            dark: '#9A7B2C',
            muted: '#7A6220',
          },
          emerald: {
            DEFAULT: '#10B981',
            glow: '#059669',
            dark: '#064E3B',
          },
          crimson: {
            DEFAULT: '#EF4444',
            dark: '#7F1D1D',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'executive': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'gold-glow': '0 0 24px -4px rgba(212, 175, 55, 0.25)',
        'emerald-glow': '0 0 24px -4px rgba(16, 185, 129, 0.3)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
