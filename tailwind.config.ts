import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        zoomInOut1: "zoomInOut1 6.4s infinite",
        zoomInOut2: "zoomInOut2 6.4s infinite",
        zoomInOut3: "zoomInOut3 1s infinite",
        zoomInOut4: "zoomInOut4 1s infinite",
      },
      keyframes: {
        zoomInOut1: {
          "0%, 100%": {
            transform: "scaleX(0.2) scaleY(2)",
          },
          "90%": {
            transform: "scale(1)",
          },
        },
        zoomInOut2: {
          "0%, 100%": {
            transform: "scaleX(0.4) scaleY(1)",
          },
          "94%": {
            transform: "scale(1)",
          },
        },
        zoomInOut3: {
          "0%, 100%": {
            transform: "scaleX(0.98) scaleY(1.02)",
          },
          "50%": {
            transform: "scale(1)",
          },
        },
        zoomInOut4: {
          "0%, 100%": {
            transform: "scaleX(0.98) scaleY(1.02)",
          },
          "50%": {
            transform: "scale(1)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
