import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-press-start-2p)"],
      },
      animation: {
        glow: "glow 2s infinite",
        slot: "slot-machine 0.5s ease-out",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6",
          },
          "50%": {
            boxShadow: "0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6",
          },
        },
        "slot-machine": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config; 