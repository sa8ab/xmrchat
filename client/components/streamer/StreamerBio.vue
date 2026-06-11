<script setup lang="ts">
const props = defineProps<{
  bio?: string;
}>();

const modalRef = ref(false);

const openModal = () => {
  modalRef.value = true;
};
</script>

<template>
  <div>
    <UButton variant="link" @click="openModal"> Bio </UButton>
  </div>
  <UModal v-model="modalRef">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Bio</h2>
      </template>
      <p class="text-sm whitespace-pre-wrap">{{ bio }}</p>

      <template #footer>
        <UButton variant="soft" @click="modalRef = false">{{
          $t("close")
        }}</UButton>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
