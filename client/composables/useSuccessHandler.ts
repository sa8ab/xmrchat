export const useSuccessHandler = () => {
  const successHandler = (e: any) => {
    console.log(e);
  };
  return {
    successHandler,
  };
};
