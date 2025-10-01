<script lang="ts" setup>
import type { LiveStream } from "~/types";

const { axios } = useApp();
const { data, status, error } = useLazyAsyncData(
  "live-streams",
  async () => {
    const { data } = await axios.get<{ liveStreams: LiveStream[] }>(
      "/live-streams"
    );
    return data.liveStreams;
  },
  { server: false }
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-center lg:text-start font-bold text-2xl">Live Now</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <template v-if="(status === 'pending' || status === 'idle') && !data">
        <USkeleton class="h-[180px] w-full" v-for="x in 3" />
      </template>
      <template v-else-if="data?.length">
        <LiveStreamItem v-for="liveStream in data" :liveStream="liveStream" />
      </template>
      <div v-else class="col-span-full">
        <NoItems text="No streamers are live right now." />
      </div>
    </div>
  </div>
</template>
