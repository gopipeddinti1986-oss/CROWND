import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-subtle": "var(--color-surface-subtle)",
        foreground: "var(--color-text)",
        muted: "var(--color-muted)",
        "muted-subtle": "var(--color-muted-subtle)",
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          subtle: "var(--color-accent-subtle)",
          foreground: "var(--color-accent-fg)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          surface: "var(--color-danger-surface)",
          text: "var(--color-danger-text)",
          border: "var(--color-danger-border)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          surface: "var(--color-warning-surface)",
          text: "var(--color-warning-text)",
          border: "var(--color-warning-border)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          surface: "var(--color-success-surface)",
          text: "var(--color-success-text)",
          border: "var(--color-success-border)",
        },
      },
      borderRadius: {
        none: "0",
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
        lg: "8px",
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Source Serif 4",
          "Newsreader",
          "Noto Serif Telugu",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Source Sans 3",
          "IBM Plex Sans",
          "Noto Sans",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1120px",
      },
      boxShadow: {
        hairline: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        surface: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)",
        modal: "0 4px 16px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
