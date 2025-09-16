/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f8faf8",
          100: "#e8ede9",
          200: "#d1dcd3",
          300: "#a8bba9",
          400: "#859988",
          500: "#677d6a",
          600: "#526354",
          700: "#435144",
          800: "#394439",
          900: "#313931",
        },
        brand: {
          yellow: {
            light: "#FFE082",
            DEFAULT: "#FFC107",
            dark: "#FFA000",
          },
          red: {
            light: "#EF5350",
            DEFAULT: "#D32F2F",
            dark: "#B71C1C",
          },
          teal: {
            light: "#26A69A",
            DEFAULT: "#00796B",
            dark: "#004D40",
          },
          sage: {
            light: "#E8EDE9",
            DEFAULT: "#A8BBA9",
            dark: "#526354",
          },
        },
        primary: {
          50: "#FFF7ED", // Lightest cream
          100: "#FFE4CC", // Light cream
          200: "#FFD4A8", // Soft peach
          300: "#FDBA74", // Warm peach
          400: "#FB923C", // Soft terracotta
          500: "#EA580C", // Rich terracotta
          600: "#C2410C", // Deep terracotta
          700: "#9A3412", // Earth brown
          800: "#7C2D12", // Deep earth
          900: "#431407", // Darkest earth
        },
        ayurveda: {
          haldi: "#FFC107", // Turmeric yellow
          ashwagandha: "#8D6E63", // Healing herb brown
          brahmi: "#558B2F", // Sacred herb green
          kumkum: "#D32F2F", // Sacred red
          chandana: "#BCAAA4", // Sandalwood beige
          triphala: "#795548", // Herbal brown
          neem: "#33691E", // Neem green
          lotus: "#FFC0CB", // Lotus pink
        },
        dosha: {
          vata: "#90A4AE", // Air/Space - Cool gray
          pitta: "#FF5722", // Fire - Warm orange-red
          kapha: "#00695C", // Earth/Water - Deep teal
        },
      },
      fontFamily: {
        sans: ["Mukta", "system-ui", "sans-serif"],
        display: ["Amita", "serif"], // Decorative font for headings with Indian aesthetics
        body: ["Mukta", "system-ui", "sans-serif"],
        decorative: ["Rozha One", "serif"], // For special headings and titles
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.02em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "3.25rem", letterSpacing: "-0.03em" }],
        "6xl": [
          "3.75rem",
          { lineHeight: "3.75rem", letterSpacing: "-0.035em" },
        ],
        "7xl": ["4.5rem", { lineHeight: "4.5rem", letterSpacing: "-0.04em" }],
      },
      backgroundImage: {
        "mandala-pattern": "url('/patterns/mandala-bg.svg')",
        "ayurvedic-herbs": "url('/patterns/herbs-bg.svg')",
        "lotus-pattern": "url('/patterns/lotus-bg.svg')",
        "mandala-small": "url('/patterns/mandala-small.svg')",
        "corner-mandala": "url('/patterns/corner-mandala.svg')",
        "om-symbol": "url('/patterns/om-symbol.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from var(--angle), var(--tw-gradient-stops))",
      },
      borderRadius: {
        lotus: "50% 50% 50% 50% / 60% 60% 40% 40%",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backgroundGradient: {
        wellness:
          "linear-gradient(to right, var(--tw-colors-brand-teal), var(--tw-colors-brand-yellow))",
        healing:
          "linear-gradient(to right, var(--tw-colors-brand-red), var(--tw-colors-brand-teal))",
        wisdom:
          "linear-gradient(to right, var(--tw-colors-brand-yellow), var(--tw-colors-brand-sage))",
      },
      boxShadow: {
        "inner-sm": "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "inner-md": "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
        "inner-lg": "inset 0 4px 6px -1px rgb(0 0 0 / 0.15)",
        "elevation-1": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "elevation-2": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
        "elevation-3":
          "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        "elevation-4":
          "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 5s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
        "spin-reverse": "spin 1s linear infinite reverse",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-soft": "bounce 3s infinite",
        shimmer: "shimmer 3s linear infinite",
        wave: "wave 2.5s infinite",
        "pulse-subtle": "pulseSubtle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        pulseSubtle: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: ".9",
            transform: "scale(1.01)",
          },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionTimingFunction: {
        "bounce-start": "cubic-bezier(0.8, 0, 1, 1)",
        "bounce-end": "cubic-bezier(0, 0, 0.2, 1)",
      },
      transitionDuration: {
        400: "400ms",
      },
      ringWidth: {
        3: "3px",
        6: "6px",
        10: "10px",
      },
      ringOffsetWidth: {
        3: "3px",
        6: "6px",
        10: "10px",
      },
    },
  },
  plugins: [],
};
