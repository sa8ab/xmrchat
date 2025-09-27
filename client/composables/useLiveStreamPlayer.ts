import type { LiveStream } from "~/types";
import { LiveStreamPlatformEnum } from "~/types/enums";

export const useLiveStreamPlayer = (
  liveStreams?: MaybeRef<LiveStream[] | undefined>
) => {
  const streams = computed(() => unref(liveStreams));

  const youtube = computed(() =>
    streams.value?.find(
      (stream) => stream.platform === LiveStreamPlatformEnum.YOUTUBE
    )
  );

  const liveStreamComputed = computed(() => {
    if (youtube.value) return youtube.value;
  });
  return {
    liveStream: liveStreamComputed,
  };
};
