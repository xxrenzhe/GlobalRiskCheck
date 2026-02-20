/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      },
      colors: {
        night: "#121212",
        neon: "#00FF00",
        danger: "#FF3333",
        steel: "#1b1f24"
      },
      boxShadow: {
        pulse: "0 0 0 0 rgba(0, 255, 0, 0.6)",
        glow: "0 0 25px rgba(0, 255, 0, 0.35)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(0, 255, 0, 0.12) 1px, transparent 0)",
        haze: "radial-gradient(circle at top, rgba(0, 255, 0, 0.12), transparent 55%)"
      },
      keyframes: {
        pulse: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(0, 255, 0, 0.6)" },
          "70%": { transform: "scale(1.02)", boxShadow: "0 0 0 20px rgba(0, 255, 0, 0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(0, 255, 0, 0)" }
        },
        scan: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" }
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" }
        }
      },
      animation: {
        pulse: "pulse 2.2s infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
