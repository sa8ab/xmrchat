<script lang="ts" setup>
const active = ref(false);

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    active.value = false;
  }
);
</script>

<template>
  <div>
    <div
      class="border rounded-lg border-border mt-3 p-4 pt-8 sticky top-0 hidden lg:flex"
    >
      <StreamerMenuContent />
    </div>
    <div class="lg:hidden">
      <UButton @click="active = true" icon="i-heroicons-bars-2">Menu</UButton>
      <USlideover
        v-model="active"
        side="left"
        :ui="{
          background: 'bg-background dark:bg-background',
          width: 'max-w-[320px]',
        }"
      >
        <div class="p-4 py-6">
          <StreamerMenuContent />
        </div>
      </USlideover>
    </div>
  </div>
</template>

<style scoped></style>
