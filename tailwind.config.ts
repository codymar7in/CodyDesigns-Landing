import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#60A5FA",
          glow: "#4F46E5",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F4F7FB",
          strong: "#E2E8F0",
          base: "#050B12",
          muted: "#0F172A",
          elevated: "#111C2E",
          outline: "#1E293B",
        },
        ink: {
          DEFAULT: "#0F172A",
          soft: "#334155",
          muted: "#64748B",
          inverted: "#F8FAFC",
          accent: "#CBD5F5",
        },
      },
      boxShadow: {
        card: "0 40px 80px -40px rgba(15, 23, 42, 0.35)",
        button: "0 18px 40px -12px rgba(37, 99, 235, 0.65)",
        "card-dark": "0 45px 90px -45px rgba(15, 23, 42, 0.75)",
        "button-dark": "0 24px 45px -20px rgba(59, 130, 246, 0.55)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.02) 45%, transparent 65%)",
        "hero-grid-dark":
          "radial-gradient(circle at top, rgba(79, 70, 229, 0.35) 0%, rgba(15, 23, 42, 0.6) 45%, rgba(2, 6, 23, 0.9) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;

