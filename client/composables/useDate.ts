export const useDate = () => {
  const dayjs = useDayjs();

  const formatTime = (v: string) => {
    return dayjs(v).format("HH:mm");
  };

  const format = (v: string, f: string) => {
    return dayjs(v).format(f);
  };

  return {
    formatTime,
    dayjs,
  };
};
