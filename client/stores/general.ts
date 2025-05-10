import { parse, stringify } from "zipson";
import { TipDisplayMode } from "~/types/enums";

interface State {
  tipDisplayValue?: TipDisplayMode;
}

export const useGeneralStore = defineStore(
  "general",
  () => {
    const state: State = reactive({
      tipDisplayValue: undefined,
    });

    return {
      state,
    };
  },
  {
    // persist: {
    //   serializer: {
    //     deserialize: parse,
    //     serialize: stringify,
    //   },
    // },
  }
);
