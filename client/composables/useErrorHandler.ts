export const useErrorHandler = () => {
  const errorHandler = (e: any) => {
    console.log(e);
  };
  return {
    errorHandler,
  };
};
