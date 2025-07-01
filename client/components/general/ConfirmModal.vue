<script lang="ts" setup>
const { state, hide } = useConfirmModal();

const handleAccept = () => {
  state.value.onConfirm?.();
  hide();
};
</script>

<template>
  <UModal v-model="state.active">
    <UCard>
      <template #header v-if="state.title">
        <h2 class="text-xl font-medium">{{ state.title }}</h2>
      </template>
      <div>
        {{ state.text }}
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton :color="state.color as any || 'red'" @click="handleAccept">{{
            $t("confirm")
          }}</UButton>
          <UButton variant="ghost" @click="hide">{{ $t("cancel") }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
