import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default <Partial<Config>>{
  theme: {
    extend: {
      // Nuxt UI generates primary color key. modified on @/assets/style/main.scss
      colors: {
        border: "rgba(var(--color-border), <alpha-value>)",
        pale: "rgba(var(--color-pale), <alpha-value>)",
        text: "rgba(var(--color-text-default), <alpha-value>)",
        background: "rgba(var(--color-background), <alpha-value>)",
        "background-2": "rgba(var(--color-background-2), <alpha-value>)",
      },
    },
  },
};
