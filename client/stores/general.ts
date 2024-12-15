import { parse, stringify } from "zipson";
import { SupportedDisplayCurrency } from "~/types/enums";

interface State {
  tipDisplayValue: SupportedDisplayCurrency;
}

export const useGeneralStore = defineStore(
  "general",
  () => {
    const state: State = reactive({
      tipDisplayValue: SupportedDisplayCurrency.XMR,
    });

    return {
      state,
    };
  },
  {
    persist: {
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
    },
  }
);
