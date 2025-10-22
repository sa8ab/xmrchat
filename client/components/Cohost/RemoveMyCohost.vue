<script setup lang="ts">
import { ConfirmModal } from "#components";

const { axios } = useApp();
const { toStreamerDisplay } = useRouteLocation();
const loadingRemove = ref(false);
const authStore = useAuthStore();
const toast = useToast();

const modal = useModal();

const handleRemoveClick = () => {
  modal.open(ConfirmModal, {
    title: "Remove from cohost",
    text: "Are you sure you want to remove yourself from the cohost of the page? You should be invited again to be able to cohost the page again.",
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
      description: "You have been removed from the cohost of the page.",
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
    Remove from cohost
  </UButton>
</template>

<style scoped></style>
