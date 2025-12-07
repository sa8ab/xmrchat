<script setup lang="ts">
import type { SuperDm } from "~/types";

const route = useRoute();
const { axios } = useApp();
const { getViewerSavedKey } = useSuperDm();

const superDmId = computed(() => route.params.id as string);
const pagePath = computed(() => route.params.streamerId as string);

const { data, error, pending } = await useLazyAsyncData(async () => {
  // get super dm
  const { data } = await axios.get<{ superDm: SuperDm }>(
    `/super-dms/${superDmId.value}`
  );

  // get keys for super dm
  const keys = await getViewerSavedKey({
    pagePath: pagePath.value,
    superDmId: superDmId.value,
  });

  return {
    superDm: data.superDm,
    keys,
  };
});

if (error.value) {
  throw createError(error.value);
}
</script>

<template>
  <div class="inner pt-4 pb-10">
    <template v-if="pending && !data">
      <!-- <SuperDmSkeleton /> -->
      Pending
    </template>
    <template v-else-if="error">
      <ErrorView :error="error" :showBackToHome="false" />
    </template>
    <template v-else>
      <PageTitle
        :title="`Super DM - ${data?.superDm.name}`"
        description="Send super DM to the streamer"
      />
      <div></div>
    </template>
  </div>
</template>
