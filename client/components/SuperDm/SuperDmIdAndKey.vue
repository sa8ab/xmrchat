<script setup lang="ts">
const props = defineProps<{
  superDmId?: string;
  recoveryKey?: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();
</script>

<template>
  <div class="grid gap-2 mb-4">
    <UAlert color="primary" variant="subtle">
      <template #title> Save Super DM id and Recovery code </template>
      <template #description>
        Please save Super DM id and Recovery key. The keys can not be reused.
        You will not be able to recover/decrypt the messages without them.
        XMRChat will not store your recovery keys.
      </template>
    </UAlert>

    <UFormGroup label="Super DM id">
      <UInput readonly :modelValue="superDmId" />
    </UFormGroup>
    <UFormGroup label="Recovery key">
      <UInput readonly :modelValue="recoveryKey" />
    </UFormGroup>
    <div class="flex justify-center">
      <UButton @click="emit('saved')" size="lg">
        I saved id and recovery key
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
