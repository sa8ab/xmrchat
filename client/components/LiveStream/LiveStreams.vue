<script lang="ts" setup>
import type { LiveStream } from "~/types";

const props = defineProps<{
  liveStreams?: LiveStream[] | null;
  pending?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-center lg:text-start font-bold text-2xl">Live Now</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <template v-if="pending && !liveStreams">
        <USkeleton class="h-[180px] w-full" v-for="x in 3" />
      </template>
      <template v-else-if="liveStreams?.length">
        <LiveStreamItem
          v-for="liveStream in liveStreams"
          :liveStream="liveStream"
        />
      </template>
      <div v-else class="col-span-full">
        <NoItems text="No streamers are live right now." />
      </div>
    </div>
  </div>
</template>
