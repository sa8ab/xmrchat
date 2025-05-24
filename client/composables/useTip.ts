import type { StreamerPage, Tip } from "~/types";

interface IParams {
  page?: MaybeRef<StreamerPage | undefined | null>;
  // tip?: MaybeRef<Tip | undefined>;
}

export const useTip = (params: IParams) => {
  const { dayjs, relativeDate } = useDate();
  const { t } = useI18n();

  const getDisappearText = (date?: string) => {
    const page = unref(params.page);
    if (!date || !page?.expirationMinutes) return undefined;
    const expirationDate = dayjs(date).add(page.expirationMinutes, "minute");

    const relative = relativeDate(expirationDate.toISOString());

    const difference = expirationDate.diff(dayjs(), "days");

    if (difference >= 30) return undefined;

    return t("disappearsX", { time: relative });
  };

  return {
    getDisappearText,
  };
};
