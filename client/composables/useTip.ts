import type { StreamerPage, Tip } from "~/types";

interface IParams {
  page?: MaybeRef<StreamerPage | undefined | null>;
  soundUrl?: MaybeRef<string | undefined>;
  // tip?: MaybeRef<Tip | undefined>;
}

export const useTip = (params: IParams) => {
  const { dayjs, relativeDate } = useDate();
  const config = useRuntimeConfig();
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

  const soundUrl = computed(() => {
    const url = unref(params.soundUrl);
    if (!url) return "/sounds/obs-sound-1.mp3";
    return `${config.public.imageBaseUrl}${url}`;
  });

  const getSoundUrl = (tip?: Tip) => {
    if (!tip?.pageTipTier?.sound?.url) return soundUrl.value;
    return `${config.public.imageBaseUrl}${tip.pageTipTier.sound.url}`;
  };

  return {
    getDisappearText,
    getSoundUrl,
  };
};
