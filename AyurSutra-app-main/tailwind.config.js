/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
      backgroundImage: {
        "mandala-pattern": "url('/patterns/mandala-bg.png')",
        "ayurvedic-herbs": "url('/patterns/herbs-bg.png')",
        "lotus-pattern": "url('/patterns/lotus-bg.png')",
      },
      borderRadius: {
        lotus: "50% 50% 50% 50% / 60% 60% 40% 40%",
      },
      backgroundGradient: {
        sunrise:
          "linear-gradient(to right, var(--tw-colors-ayurveda-kumkum), var(--tw-colors-ayurveda-haldi))",
        healing:
          "linear-gradient(to right, var(--tw-colors-ayurveda-brahmi), var(--tw-colors-ayurveda-neem))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 5s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
        shimmer: "shimmer 3s linear infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
