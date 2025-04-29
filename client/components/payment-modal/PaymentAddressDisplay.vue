<script lang="ts" setup>
const props = defineProps<{
  address?: string;
}>();

const toast = useToast();
const { t } = useI18n();

const copy = () => {
  try {
    navigator.clipboard.writeText(props.address || "");
    toast.add({
      description: "Copied to your clipboard.",
      color: "green",
    });
  } catch (error) {
    toast.add({
      description: "Could not copy.",
    });
  }
};
</script>

<template>
  <div class="payment-address-input w-full">
    <UInput
      disabled
      :modelValue="address"
      class="w-full cursor-none"
      size="lg"
    />
    <UButton class="button" size="sm" @click="copy">{{
      t("copyAddress")
    }}</UButton>
  </div>
</template>

<style scoped lang="scss">
.payment-address-input {
  @apply flex gap-2;
  input {
    @apply py-5;
  }
}
</style>
