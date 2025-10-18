<script lang="ts" setup>
const { axios } = useApp();
const { toIndex } = useRouteLocation();
const route = useRoute();
const code = computed(() => route.query.code as string);

const { error, data, pending } = useLazyAsyncData(
  async () => {
    await axios.post(`/cohost-invitations/accept/${code.value}`);
  },
  { server: false }
);

const renderTitle = computed(() => {
  if (pending.value) return "Accepting invitation";
  if (error.value) return "Invitation failed";
  if (data.value) return "Invitation accepted";
  return "Accepting invitation";
});
</script>

<template>
  <div class="flex flex-col inner">
    <h1 class="text-2xl font-bold pt-10 pb-4 text-center">{{ renderTitle }}</h1>
    <GeneralLoading v-if="pending" />
    <div v-else-if="error" class="flex flex-col gap-4 items-center">
      <UAlert
        class="max-w-[480px]"
        color="red"
        :description="getErrorMessage(error)"
        title="Invitation failed"
      ></UAlert>
      <UButton :to="toIndex()">{{ $t("goToHomePage") }}</UButton>
    </div>
    <div v-else-if="data" class="flex flex-col gap-4 items-center">
      <UAlert
        class="max-w-[480px]"
        color="green"
        title="Invitation accepted"
        description="You are now a cohost of the page."
      ></UAlert>
      <UButton :to="toIndex()">{{ $t("goToHomePage") }}</UButton>
    </div>
  </div>
</template>
