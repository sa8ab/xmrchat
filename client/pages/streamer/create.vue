<script lang="ts" setup>
import type { SlugReservationResponse } from "~/types";

const { toIndex } = useRouteLocation();

useHead({
  title: "Create Page",
});

const links = computed(() => [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: toIndex(),
  },
  {
    label: "Create Page",
    icon: "i-heroicons-folder-plus-solid",
  },
]);

const reservedData = ref<SlugReservationResponse | undefined>(undefined);
const reservedSlug = ref<string | undefined>(undefined);

const paymentModalActive = ref(false);

const handlePayment = (params: {
  data: SlugReservationResponse;
  slug?: string;
}) => {
  reservedData.value = params.data;
  reservedSlug.value = params.slug;
  paymentModalActive.value = true;
};

const cancelPayment = () => {
  paymentModalActive.value = false;
  reservedData.value = undefined;
  reservedSlug.value = undefined;
};
</script>

<template>
  <div class="inner">
    <div class="flex flex-col mt-5 md:mt-10">
      <UBreadcrumb :links="links" />
      <PageTitle
        title="Create Page"
        desciption="Get started by creating your streamer page"
      />
    </div>

    <StreamerModifyForm :editable="false" @done="handlePayment" />
  </div>
  <StreamerPaymentModal
    :reservedData="reservedData"
    :reservedSlug="reservedSlug"
    v-model:active="paymentModalActive"
    @cancel="cancelPayment"
  />
</template>

<style scoped lang="scss"></style>
