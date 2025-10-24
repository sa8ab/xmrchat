<script setup lang="ts">
import { ConfirmModal } from "#components";
import type { User } from "~/types";

const props = defineProps<{
  cohost: User;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const { dayjs, relativeDate } = useDate();
const { axios } = useApp();
const toast = useToast();
const modal = useModal();

const loadingRemove = ref(false);

const handleRemoveClick = () => {
  modal.open(ConfirmModal, {
    title: "Remove cohost",
    text: "Are you sure you want to remove this cohost?",
    color: "red",
    onConfirm: () => handleRemove(),
  });
};

const handleRemove = async () => {
  loadingRemove.value = true;
  try {
    await axios.delete(`/cohosts/${props.cohost.id}`);
    toast.add({
      description: "Cohost removed",
      color: "green",
    });
    emit("remove");
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
  <div class="grid gap-2">
    <div
      class="rounded-lg ring-1 ring-border px-6 py-4 flex gap-3 items-center"
    >
      <div
        class="p-2 rounded-full ring-1 ring-border flex items-center justify-center"
      >
        <UIcon name="i-heroicons-user" size="20" />
      </div>
      <div class="flex-1">
        <p class="font-medium">{{ cohost.email }}</p>
      </div>
      <div>
        <UButton
          color="red"
          variant="ghost"
          :loading="loadingRemove"
          @click="handleRemoveClick"
          >Remove</UButton
        >
      </div>
    </div>
  </div>
</template>
