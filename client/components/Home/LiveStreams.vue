<script lang="ts" setup>
import type { LiveStream } from "~/types";

const { axios } = useApp();
const { data, pending } = useLazyAsyncData(
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
  <!-- move to start of grid -->
  <div class="flex flex-col gap-4">
    <h3 class="text-center lg:text-start font-bold text-2xl">Live streams</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <LiveStreamItem v-for="liveStream in data" :liveStream="liveStream" />
    </div>
  </div>
</template>
