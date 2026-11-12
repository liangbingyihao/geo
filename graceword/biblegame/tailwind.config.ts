import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f6efe1",
        ink: "#241d16",
        gold: "#b8862f",
      },
      fontFamily: {
        serif: ["Georgia", "Noto Serif TC", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
