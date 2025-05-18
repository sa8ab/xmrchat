<script lang="ts" setup>
import type { SlugReservationResponse } from "~/types";
import type { FiatEnum } from "~/types/enums";

const { toIndex } = useRouteLocation();
const { t } = useI18n();

useHead(() => ({
  title: t("createPage"),
}));

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
const fiat = ref<FiatEnum | undefined>(undefined);

const paymentModalActive = ref(false);

const handlePayment = (params: {
  data: SlugReservationResponse;
  slug?: string;
  fiat?: FiatEnum;
}) => {
  reservedData.value = params.data;
  reservedSlug.value = params.slug;
  fiat.value = params.fiat;
  paymentModalActive.value = true;
};

const cancelPayment = () => {
  paymentModalActive.value = false;
  reservedData.value = undefined;
  reservedSlug.value = undefined;
  fiat.value = undefined;
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
    :fiat="fiat"
    v-model:active="paymentModalActive"
    @cancel="cancelPayment"
  />
</template>

<style scoped lang="scss"></style>
