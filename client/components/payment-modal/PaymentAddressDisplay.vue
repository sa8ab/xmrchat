<script lang="ts" setup>
const props = defineProps<{
  address?: string;
}>();

const copy = () => {
  const textarea: any = document.createElement("textarea");
  textarea.value = props.address;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};
</script>

<template>
  <div class="payment-address-input w-full">
    <UInput disabled :value="address" class="w-full cursor-none" size="lg" />
    <UButton class="button" size="sm" @click="copy">Copy Address</UButton>
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
