import type { Numberic, StreamerPage } from "~/types";

const getFirstErrorMessage = (message: any) => {
  if (Array.isArray(message)) return message[0];
  return message;
};

export const getErrorMessage = (error?: any) => {
  if (!error) return undefined;
  if (error.response?.data?.message)
    return getFirstErrorMessage(error.response?.data?.message);
  if (error.response?.data?.error) return error.response?.data?.error;
  if (error.message) return error.message;
  return undefined;
};

export const getProperty = (obj: any, path: string): any => {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
};

export const getFirstStreamerPage = (pages?: StreamerPage[]) => {
  if (!pages || !pages.length) return undefined;
  return pages.toSorted((a, b) => b.path.localeCompare(a.path))[0];
};

export const unitsToXmr = (v?: string) => {
  if (!v) return undefined;
  return parseInt(v) / 1e12;
};

export const arrayToObject = <T extends Record<K, any>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T> => {
  return array.reduce((result, item) => {
    const keyValue = item[key];
    if (typeof keyValue === "string" || typeof keyValue === "number") {
      result[keyValue] = item;
    }
    return result;
  }, {} as Record<string, T>);
};

export const generateWalletLink = (data: {
  ticker: string;
  address?: string;
  amount?: Numberic;
  description?: string;
}) => {
  if (!data.address || !data.amount) return undefined;
  if (data.ticker === "xmr")
    return `monero:${data.address}?tx_amount=${data.amount}&tx_description=${
      data.description || ""
    }`;

  if (data.ticker === "ltc")
    return `litecoin:${data.address}?amount=${data.amount}`;

  if (data.ticker === "btc")
    return `bitcoin:${data.address}?amount=${data.amount}`;

  if (data.ticker === "bch")
    return `bitcoincash:${data.address}?amount=${data.amount}`;

  if (data.ticker === "usdt")
    return `tron:${data.address}?amount=${data.amount}`;

  return undefined;
};
