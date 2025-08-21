import { createSystem, defaultConfig } from "@chakra-ui/react";
import { themeConfig } from "./config";

// Create Chakra UI v3 system
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#f7f7f7" },
          100: { value: "#e8e8e8" },
          200: { value: "#d1d1d1" },
          300: { value: "#b9b9b9" },
          400: { value: "#a2a2a2" },
          500: { value: "#8a8a8a" },
          600: { value: "#737373" },
          700: { value: "#5c5c5c" },
          800: { value: "#444444" },
          900: { value: "#1a1a1a" },
        },
        accent: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          700: { value: "#374151" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
        },
      },
      fonts: {
        heading: { value: themeConfig.fonts.heading },
        body: { value: themeConfig.fonts.body },
      },
      breakpoints: {
        sm: { value: themeConfig.breakpoints.sm },
        md: { value: themeConfig.breakpoints.md },
        lg: { value: themeConfig.breakpoints.lg },
        xl: { value: themeConfig.breakpoints.xl },
        "2xl": { value: themeConfig.breakpoints["2xl"] },
      },
    },
  },
});
