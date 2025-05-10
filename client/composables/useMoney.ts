import { FiatEnum } from "~/types/enums";

export const useMoney = () => {
  const { getFiat } = useConstants();
  const money = (amount?: string | number, fiat: FiatEnum = FiatEnum.USD) => {
    const item = getFiat(fiat);
    return `${item.symbol} ${amount}`;
  };
  return {
    money,
  };
};
