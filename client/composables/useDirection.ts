const useDirection = () => {
  const { locales, locale } = useI18n();

  const direction = computed(() => {
    const currentLocale = locales.value.find((l) => l.code === locale.value);
    return currentLocale?.dir === "rtl" ? "rtl" : "ltr";
  });

  return { direction };
};

export default useDirection;
