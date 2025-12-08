<script setup lang="ts">
import useVuelidate from "@vuelidate/core";

const emit = defineEmits<{
  send: [];
}>();

const { required } = useValidations();

const model = defineModel<string | undefined>();

const handleSend = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  emit("send");
};

const v = useVuelidate(
  {
    message: { required },
  },
  computed(() => ({ message: model.value }))
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div class="flex gap-2 p-4 border-t border-border items-start">
    <UInput
      v-model="model"
      placeholder="Send a message..."
      class="flex-grow"
      size="lg"
      @blur="getValidationAttrs('message').onBlur"
    />
    <UButton
      size="lg"
      icon="heroicons:paper-airplane-20-solid"
      square
      @click="handleSend"
    >
    </UButton>
  </div>
</template>

<style scoped></style>
