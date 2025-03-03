<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});

const model = defineModel<string | number | undefined>();
const passwordVisible = ref(false);
</script>

<template>
  <div class="flex gap-1">
    <UInput
      class="flex-grow"
      :type="passwordVisible ? 'text' : 'password'"
      v-model="model"
      v-bind="$attrs"
    >
    </UInput>
    <UButton
      v-if="passwordVisible"
      @click="passwordVisible = false"
      icon="i-heroicons-eye-slash"
      square
      color="gray"
    ></UButton>
    <UButton
      v-else
      @click="passwordVisible = true"
      icon="i-heroicons-eye"
      square
      color="gray"
    ></UButton>
  </div>
</template>

<style scoped></style>
