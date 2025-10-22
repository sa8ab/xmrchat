<script setup lang="ts">
import { ConfirmModal } from "#components";

const { axios } = useApp();
const loadingRemove = ref(false);

const modal = useModal();

const handleRemoveClick = () => {
  modal.open(ConfirmModal, {
    title: "Remove from cohost",
    text: "Are you sure you want to remove yourself from the cohost of the page? You should be invited again to be able to cohost the page again.",
    color: "red",
    onConfirm: () => handleRemove(),
  });
};

// TODO: add api request to /cohosts/remove-my-cohost
// navigate to streamer index after success
// update auth store state

const handleRemove = () => {};
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
