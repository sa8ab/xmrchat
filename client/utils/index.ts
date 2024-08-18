import type { StreamerPage } from "~/types";

export const getErrorMessage = (error?: any) => {
  if (!error) return undefined;
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
