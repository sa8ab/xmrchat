<script lang="ts" setup>
import type { LiveStream } from "~/types";

useHead({});

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
  <div class="inner">
    <HomeHero />
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-8">
      <HomeFAQ :class="data?.length ? `` : `col-span-full`" />
      <LiveStreams
        v-if="data?.length"
        :liveStreams="data"
        :pending="status === 'pending' || status === 'idle'"
        class="row-start-1 lg:row-start-auto"
      />
    </div>
  </div>
</template>

<style scoped></style>
