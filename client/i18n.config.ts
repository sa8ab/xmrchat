import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import de from "./locales/de";

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    en,
    es,
    fr,
    de,
  },
}));
