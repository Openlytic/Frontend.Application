import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          active: "#3730A3",
          soft: "#EEF2FF",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          soft: "#EDE9FE",
        },
        ink: {
          DEFAULT: "#1E1B4B",
          soft: "#312E81",
        },
        page: "#F8FAFC",
        line: "#E2E8F0",
        "line-light": "#F1F5F9",
        muted: "#64748B",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        poppins: [
          "var(--font-poppins)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(30 27 75 / 0.06), 0 1px 2px -1px rgb(30 27 75 / 0.06)",
        "card-hover":
          "0 8px 24px -6px rgb(79 70 229 / 0.18), 0 2px 8px -2px rgb(30 27 75 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
