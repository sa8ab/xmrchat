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

  const twitch = computed(() =>
    streams.value?.find(
      (stream) => stream.platform === LiveStreamPlatformEnum.TWITCH
    )
  );

  const rumble = computed(() =>
    streams.value?.find(
      (stream) => stream.platform === LiveStreamPlatformEnum.RUMBLE
    )
  );

  const liveStreamComputed = computed(() => {
    if (twitch.value) return twitch.value;
    if (youtube.value) return youtube.value;
    if (rumble.value) return rumble.value;
  });

  return {
    liveStream: liveStreamComputed,
  };
};
