<script setup lang="ts">
import { ConfirmModal } from "#components";

const { axios } = useApp();
const { toStreamerDisplay } = useRouteLocation();
const loadingRemove = ref(false);
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const modal = useModal();

const handleRemoveClick = () => {
  modal.open(ConfirmModal, {
    title: t("removeFromCohost"),
    text: t("removeYourselfFromCohost"),
    color: "red",
    onConfirm: () => handleRemove(),
  });
};

const handleRemove = async () => {
  loadingRemove.value = true;
  try {
    await axios.delete("/cohosts/remove-my-cohost");
    await navigateTo(toStreamerDisplay()?.path);
    await authStore.getMe();
    toast.add({
      description: t("youRemovedFromCohost"),
      color: "green",
    });
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    loadingRemove.value = false;
  }
};
</script>

<template>
  <UButton
    color="red"
    variant="ghost"
    trailingIcon="i-heroicons-arrow-right-on-rectangle"
    :loading="loadingRemove"
    @click="handleRemoveClick"
  >
    {{ $t("removeFromCohost") }}
  </UButton>
</template>

<style scoped></style>
