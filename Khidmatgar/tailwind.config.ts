import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        foreground: "#ffffff",
        primary: "#00D4FF",
        secondary: "#00FF88",
        accent: "#7B2FFF",
        warning: "#FFB800",
        danger: "#FF3B5C",
        "pk-green": "#01411C",
        card: "rgba(255,255,255,0.05)",
        cardBorder: "rgba(255,255,255,0.1)",
        navy: {
          900: "#0A0F1E",
          800: "#0D1428",
          700: "#111B35",
          600: "#162040",
        },
        neon: {
          blue: "#00D4FF",
          green: "#00FF88",
          purple: "#7B2FFF",
          gold: "#FFB800",
          red: "#FF3B5C",
          pink: "#FF6B9D",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        urdu: ['"Noto Nastaliq Urdu"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "count-up": "countUp 1.5s ease-out",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "typewriter": "typewriter 0.1s steps(1) forwards",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,212,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.7), 0 0 80px rgba(0,212,255,0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideUp: {
          from: { transform: "translateY(30px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)",
        "neon-green": "0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.2)",
        "neon-purple": "0 0 20px rgba(123,47,255,0.5), 0 0 40px rgba(123,47,255,0.2)",
        "card": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
