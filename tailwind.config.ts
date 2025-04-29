import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(30, 95%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
          50: "#e6f0ff",
          100: "#b3d1ff",
          200: "#80b3ff",
          300: "#4d94ff",
          400: "#1a75ff",
          500: "#0070f3",
          600: "#005cc4",
          700: "#004494",
          800: "#002d65",
          900: "#001535",
        },
        complementary: {
          DEFAULT: "hsl(var(--complementary))",
          foreground: "hsl(var(--complementary-foreground))",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'gradient-start': 'hsl(0 0% 100%)',
        'gradient-end': 'hsl(240 4.8% 95.9%)',
        'dark-gradient-start': 'hsl(0 0% 3.9%)',
        'dark-gradient-end': 'hsl(240 3.7% 15.9%)',
        'btn-gradient-start': 'hsl(214, 100%, 59%)',
        'btn-gradient-end': 'hsl(217, 91%, 60%)',
        'btn-gradient-hover-start': 'hsl(217, 91%, 60%)',
        'btn-gradient-hover-end': 'hsl(221, 83%, 53%)',
        'hero-gradient-start': 'hsl(280, 50%, 30%)',
        'hero-gradient-end': 'hsl(30, 70%, 60%)',
        'hero-foreground': 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "2px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
          },
        },
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "Inter", "sans-serif"],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 200ms ease-in-out',
        'wiggle-slow': 'wiggle 1s ease-in-out',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
