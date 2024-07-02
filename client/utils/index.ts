export const getErrorMessage = (error?: any) => {
  if (!error) return undefined;
  if (error.response?.data?.error) return error.response?.data?.error;
  if (error.message) return error.message;
  return undefined;
};

export const getProperty = (obj: any, path: string): any => {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
};
