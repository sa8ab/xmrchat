<script lang="ts" setup>
const props = defineProps<{
  title?: string;
  text?: string;
  color?: string;
}>();
const handleAccept = () => {
  emit("confirm");
  hide();
};

const modal = useModal();

const emit = defineEmits<{
  confirm: [];
}>();

const hide = () => {
  modal.close();
};
</script>

<template>
  <UModal>
    <UCard>
      <template #header v-if="title">
        <h2 class="text-xl font-medium">{{ title }}</h2>
      </template>
      <div>
        {{ text }}
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton :color="color as any || 'red'" @click="handleAccept">{{
            $t("confirm")
          }}</UButton>
          <UButton variant="ghost" @click="hide">{{ $t("cancel") }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
