import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    en,
    es,
    fr,
  },
}));
