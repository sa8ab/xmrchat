import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import de from "./locales/de";
import ru from "./locales/ru";
import fi from "./locales/fi";

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    en,
    es,
    fr,
    de,
    ru,
    fi,
  },
}));
