export const useDate = () => {
  const dayjs = useDayjs();

  const formatTime = (v: string) => {
    return dayjs(v).format("HH:mm:ss");
  };

  return {
    formatTime,
  };
};
