export const usePaymentExpiration = () => {
  const { dayjs } = useDate();

  const remaining = ref<number | undefined>();
  const expired = ref<boolean>(false);

  const initialize = (expiresAtRaw?: string) => {
    const now = dayjs();
    const expiresAt = dayjs(expiresAtRaw);

    remaining.value = expiresAt.diff(now);

    if (remaining.value < 0) expired.value = true;
  };

  return { initialize, remaining, expired };
};
