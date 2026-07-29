import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          hover: "#1E293B",
        },
        income: {
          DEFAULT: "#059669",
          light: "#ECFDF5",
        },
        expense: {
          DEFAULT: "#E11D48",
          light: "#FFF1F2",
        },
        pending: {
          DEFAULT: "#D97706",
          light: "#FFFBEB",
        },
        amortize: {
          DEFAULT: "#2563EB",
          light: "#EFF6FF",
        },
        surface: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        "text-muted": "#94A3B8",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      }
    },
  },
  plugins: [],
};

export default config;
