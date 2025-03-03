<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string;
    showIcon?: boolean;
  }>(),
  {
    showIcon: true,
  }
);

const toast = useToast();

const copy = () => {
  try {
    navigator.clipboard.writeText(props.text || "");
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
  <div class="payment-address-input flex items-center gap-1 w-full">
    <UInput disabled :modelValue="text" class="w-full cursor-none" size="lg">
    </UInput>
    <UButton
      class="button"
      size="sm"
      @click="copy"
      :square="showIcon"
      :icon="showIcon ? 'i-heroicons-clipboard' : undefined"
    >
      {{ showIcon ? "" : "Copy Text" }}
    </UButton>
  </div>
</template>
