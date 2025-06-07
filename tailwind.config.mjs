/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: "true",
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        text: {
          DEFAULT: "hsl(var(--text))",
          50: "hsl(0, 4%, 95%)",
          100: "hsl(0, 2%, 90%)",
          200: "hsl(0, 4%, 80%)",
          300: "hsl(0, 3%, 70%)",
          400: "hsl(0, 3%, 60%)",
          500: "hsl(0, 3%, 50%)",
          600: "hsl(0, 3%, 40%)",
          700: "hsl(0, 3%, 30%)",
          800: "hsl(0, 4%, 20%)",
          900: "hsl(0, 2%, 10%)",
          950: "hsl(0, 4%, 5%)",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          50: "hsl(0, 0%, 95%)",
          100: "hsl(0, 0%, 90%)",
          200: "hsl(0, 0%, 80%)",
          300: "hsl(0, 0%, 70%)",
          400: "hsl(0, 0%, 60%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 40%)",
          700: "hsl(0, 0%, 30%)",
          800: "hsl(0, 0%, 20%)",
          900: "hsl(0, 0%, 10%)",
          950: "hsl(0, 0%, 5%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(0, 15%, 95%)",
          100: "hsl(0, 18%, 90%)",
          200: "hsl(0, 18%, 80%)",
          300: "hsl(0, 18%, 70%)",
          400: "hsl(0, 17%, 60%)",
          500: "hsl(0, 17%, 50%)",
          600: "hsl(0, 17%, 40%)",
          700: "hsl(0, 18%, 30%)",
          800: "hsl(0, 18%, 20%)",
          900: "hsl(0, 18%, 10%)",
          950: "hsl(0, 15%, 5%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(0, 23%, 95%)",
          100: "hsl(0, 25%, 90%)",
          200: "hsl(0, 24%, 80%)",
          300: "hsl(0, 24%, 70%)",
          400: "hsl(0, 24%, 60%)",
          500: "hsl(0, 24%, 50%)",
          600: "hsl(0, 24%, 40%)",
          700: "hsl(0, 24%, 30%)",
          800: "hsl(0, 24%, 20%)",
          900: "hsl(0, 25%, 10%)",
          950: "hsl(0, 23%, 5%)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
