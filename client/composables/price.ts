import type { Prices } from "~/types";
import { FiatEnum } from "~/types/enums";

export const useXmrPrice = () => {
  const prices = useState<Prices>("prices", () => ({}));

  const xmrToFiat = (amount?: number, fiat: FiatEnum = FiatEnum.USD) => {
    const price = prices.value[fiat];
    if (!price) return 0;
    return amount ? amount * price : 0;
  };

  return {
    prices,
    xmrToFiat,
  };
};
