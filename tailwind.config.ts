import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          deep: "#2D4739",
          darker: "#1E3228",
          soft: "#5C7A6B",
          light: "#8BA698",
          mist: "#E6ECE8",
        },
        ivory: {
          base: "#FAF8F5",
          warm: "#F3EFEA",
          card: "#FFFFFF",
        },
        gold: {
          champagne: "#C5A059",
          light: "#DFC48C",
          dark: "#9E7B38",
        },
        blush: {
          sunset: "#F6EAE8",
          soft: "#EBD7D4",
        },
      },
      fontFamily: {
        serif: ["var(--ff-serif)", "Georgia", "serif"],
        sans: ["var(--ff-sans)", "system-ui", "sans-serif"],
        script: ["var(--ff-script)", "cursive"],
        arabic: ["var(--ff-arabic)", "serif"],
      },
      boxShadow: {
        luxury: "0 20px 50px -15px rgba(45, 71, 57, 0.12)",
        "gold-glow": "0 10px 30px -5px rgba(197, 160, 89, 0.35)",
        nav: "0 10px 35px -5px rgba(30, 50, 40, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
