/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 36% 96%)',
        text: 'hsl(220 13% 13%)',
        accent: 'hsl(205 90% 51%)',
        primary: 'hsl(220 50% 37%)',
        surface: 'hsl(0 0% 100%)',
        dark: {
          bg: 'hsl(220 27% 8%)',
          surface: 'hsl(220 27% 12%)',
          text: 'hsl(220 13% 95%)',
          muted: 'hsl(220 13% 65%)',
        },
        purple: {
          500: 'hsl(270 70% 60%)',
          600: 'hsl(270 70% 50%)',
          700: 'hsl(270 70% 40%)',
        },
        pink: {
          500: 'hsl(320 70% 60%)',
          600: 'hsl(320 70% 50%)',
        }
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        lg: '16px',
        md: '8px',
        sm: '4px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.1)',
        glow: '0 0 20px hsla(270, 70%, 60%, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}