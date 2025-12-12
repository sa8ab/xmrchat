<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string;
    showIcon?: boolean;
    size?: string;
    buttonVariant?: any;
  }>(),
  {
    showIcon: true,
    size: "lg",
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
    <UInput readonly :modelValue="text" class="w-full cursor-none" size="lg">
    </UInput>
    <UButton
      class="button"
      size="lg"
      @click="copy"
      :square="showIcon"
      :icon="showIcon ? 'i-heroicons-clipboard' : undefined"
      :variant="buttonVariant"
    >
      {{ showIcon ? "" : "Copy Text" }}
    </UButton>
  </div>
</template>
