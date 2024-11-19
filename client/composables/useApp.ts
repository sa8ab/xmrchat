export const useApp = () => {
  const nuxtApp = useNuxtApp();
  const localeRoute = useLocaleRoute();
  const navigateLocale = (...x: Parameters<typeof localeRoute>) =>
    navigateTo(localeRoute(...x));

  const errorHandler = useErrorHandler();
  const successHandler = useSuccessHandler();
  return {
    axios: nuxtApp.$axios,
    navigateLocale,
    errorHandler,
    successHandler,
  };
};
