import { AxiosError, isAxiosError } from "axios";
import type { Numberic, StreamerPage } from "~/types";
import type { H3Error } from "h3";

const getFirstErrorMessage = (message: any) => {
  if (Array.isArray(message)) return message[0];
  return message;
};

export const getErrorMessage = (error: any): string | undefined => {
  if (!error) return undefined;

  if (error.cause && isNuxtError(error)) {
    error = error.cause;
  }

  if (isAxiosError(error)) {
    const data = (error as AxiosError).response?.data as
      | { message?: string | string[]; error?: string | string[] }
      | undefined;

    const msg = data?.message ?? data?.error;

    if (msg) {
      return Array.isArray(msg) ? msg[0] : msg;
    }

    return (error as AxiosError).message;
  }

  if (error instanceof Error || error.message) {
    return error.message;
  }

  return String(error);
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
    return `usdt:${data.address}?amount=${data.amount}`;

  if (data.ticker === "usdc")
    return `usdc:${data.address}?amount=${data.amount}`;

  return undefined;
};

/**
 * Truncates a string by showing the beginning and end with ellipsis in the middle
 * @param text - The text to truncate
 * @param startCount - Number of characters to show at the beginning (default: 4)
 * @param endCount - Number of characters to show at the end (default: 4)
 * @returns The truncated string with middle ellipsis
 */
export const truncateMiddle = (
  text: string,
  startCount: number = 4,
  endCount: number = 4
): string => {
  if (!text || text.length <= startCount + endCount + 3) {
    return text;
  }

  const start = text.slice(0, startCount);
  const end = text.slice(-endCount);

  return `${start}...${end}`;
};

export const getForegroundColor = (rgb: string): "white" | "black" => {
  if (rgb.startsWith("rgb(") && rgb.endsWith(")")) {
    rgb = rgb.slice(4, -1).trim();
  }
  const [r, g, b] = rgb.split(",").map((v) => parseInt(v.trim(), 10));

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
};

export const getColorWithOpacity = (color: string, opacity: number) => {
  if (color.startsWith("rgb(") && color.endsWith(")")) {
    color = color.slice(4, -1).trim();
  }
  const [r, g, b] = color.split(",").map((v) => parseInt(v.trim(), 10));
  return `rgba(${r},${g},${b},${opacity})`;
};
