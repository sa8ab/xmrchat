import type { StreamerPage } from "~/types";

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
  if (!v) return "";
  return parseInt(v) / 1e12;
};
