import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 👈 enables class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#1D4ED8", // blue for light mode
          dark: "#2563EB", // blue for dark mode
        },
        background: {
          light: "#FFFFFF",
          dark: "#111827",
        },
        text: {
          light: "#111827",
          dark: "#F9FAFB",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
