/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Zinc 950
        foreground: "#fafafa", // Zinc 50
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#14b8a6", // Teal 500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#8b5cf6", // Violet 500
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444", // Red 500
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#18181b", // Zinc 900
          foreground: "#fafafa",
        },
        border: "#27272a", // Zinc 800
        input: "#27272a", // Zinc 800
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
