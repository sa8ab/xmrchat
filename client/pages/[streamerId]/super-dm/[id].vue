<script setup lang="ts">
const route = useRoute();
const { axios } = useApp();
const {} = useSuperDm();

const superDmId = computed(() => route.params.id as string);

const { data, error, pending } = await useLazyAsyncData(async () => {
  const { data } = await axios.get(`/super-dms/${superDmId.value}`);
  return data.superDm;
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
        :title="`Super DM - ${data.name}`"
        description="Send super DM to the streamer"
      />
      <div></div>
    </template>
  </div>
</template>
