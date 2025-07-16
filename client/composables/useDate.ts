export const useDate = () => {
  const dayjs = useDayjs();
  const { locale } = useI18n();
  dayjs.locale(locale.value === "pcm" ? "en" : locale.value);

  const formatTime = (v: string) => {
    return dayjs(v).format("HH:mm");
  };

  const format = (v: string, f: string) => {
    return dayjs(v).format(f);
  };

  const relativeDate = (v: string) => {
    return dayjs(v).fromNow();
  };

  return {
    formatTime,
    relativeDate,
    dayjs,
  };
};
