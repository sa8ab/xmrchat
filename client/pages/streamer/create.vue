<script lang="ts" setup>
import type { SlugReservationResponse } from "~/types";

const { toIndex } = useRouteLocation();
const { t } = useI18n();

useHead({
  title: "Create Page",
});

const links = computed(() => [
  {
    label: t("home"),
    icon: "i-heroicons-home",
    to: toIndex(),
  },
  {
    label: t("createPage"),
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
    <div class="flex flex-col">
      <UBreadcrumb :links="links" />
      <PageTitle
        :title="t('createPage')"
        :description="t('getStartedCreatingPage')"
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
