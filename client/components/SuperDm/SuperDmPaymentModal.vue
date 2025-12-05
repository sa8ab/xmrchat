<script lang="ts" setup>
import type { SuperDmContentData, TipEventData } from "~/types";

const props = defineProps<{
  data?: SuperDmContentData;
  slug?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  paid: [];
}>();

const active = defineModel<boolean>("active");
const paymentError = ref(false);
const partialPaymentAmount = ref<string | undefined>(undefined);

const authStore = useAuthStore();

const showWalletWarning = computed(
  () => authStore.state.page?.path === props.slug
);

const created = computed(() => props.data?.created);

const toast = useToast();
const { t } = useI18n();

const { init, disconnect, reconnect, connectionStatus } =
  usePaymentSocket<TipEventData>({
    onTipEvent: (data) => {
      if (!data.paidAt) {
        partialPaymentAmount.value = data.paidAmount;
        return;
      }

      partialPaymentAmount.value = undefined;
      toast.add({
        title: "Tip received successfully!",
      });
      disconnect();
      emit("paid");
    },

    onSwapStatusChangeEvent: (swap) => {
      console.log(swap);
      if (created.value?.swap) {
        created.value.swap.status = swap.status;
        created.value.swap.statusMessage = swap.statusMessage;
      }
    },
  });

const handleRetry = () => {
  reconnect();
};

const cancelPayment = () => {
  disconnect();
  partialPaymentAmount.value = undefined;
  emit("cancel");
};

const initSocket = () => {
  paymentError.value = false;
  init({
    path: "tips",
    query: { tipId: created.value?.id },
  });
};

watch(active, (currentActive) => {
  if (currentActive) {
    initSocket();
  } else {
    disconnect();
  }
});

onBeforeUnmount(() => disconnect());

const showKeys = ref(true);
</script>

<template>
  <UModal v-model="active" preventClose>
    <BasePaymentCard title="Start Super DM" @cancel="emit('cancel')">
      <div class="flex mb-2" v-if="!showKeys">
        <UButton variant="link" :padded="false" @click="showKeys = true">
          <DirectionalArrow direction="backward" />
          Show keys again
        </UButton>
      </div>

      <SuperDmIdAndKey
        v-if="showKeys"
        :superDmId="created?.superDm.id"
        :recoveryKey="data?.keys?.mnemonic"
        @saved="showKeys = false"
      />

      <template v-else>
        <!-- <SuperDmSwapPaymentContent
      v-if="superDm?.swap"
      @retry="handleRetry"
      @cancel="cancelPayment"t
      :createdTip="superDm"
      :connectionStatus="connectionStatus"
    >
    </SuperDmSwapPaymentContent> -->
        <SuperDmPaymentContent
          :data="data"
          :connectionStatus="connectionStatus"
          :slug="slug"
          :partialPaymentAmount="partialPaymentAmount"
          @cancel="cancelPayment"
          @retry="handleRetry"
        >
        </SuperDmPaymentContent>
      </template>
    </BasePaymentCard>
  </UModal>
</template>

<style scoped></style>
