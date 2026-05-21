import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#faf9f7",
          100: "#f3f1ed",
          200: "#e8e4dd",
          300: "#d4cdc2",
          400: "#b8aea0",
          500: "#9c8f7e",
          600: "#7d7163",
          700: "#655b50",
          800: "#544c44",
          900: "#474039",
          950: "#26221e",
        },
        terracotta: {
          DEFAULT: "#c4704a",
          light: "#d4896a",
          dark: "#a85a38",
        },
        sage: {
          DEFAULT: "#6b7f5e",
          light: "#8a9d7d",
          dark: "#526347",
        },
        cream: "#f8f5f0",
        charcoal: "#2c2825",
      },
      fontFamily: {
        display: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "stone-texture":
          "linear-gradient(135deg, #f3f1ed 0%, #e8e4dd 50%, #d4cdc2 100%)",
        "hero-gradient":
          "linear-gradient(to bottom, rgba(38,34,30,0.4), rgba(38,34,30,0.7))",
      },
    },
  },
  plugins: [],
};

export default config;
