<script lang="ts" setup>
const active = ref(false);

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    active.value = false;
  },
);
</script>

<template>
  <div class="mt-4">
    <div class="border rounded-lg border-border sticky top-0 hidden lg:block">
      <slot />
    </div>
    <div class="lg:hidden">
      <UButton @click="active = true">
        {{ $t("menu") }}
        <DirectionalArrow type="chevron" />
      </UButton>
      <USlideover
        v-model="active"
        side="left"
        :ui="{
          background: 'bg-background dark:bg-background',
          width: 'max-w-[320px]',
        }"
      >
        <slot />
      </USlideover>
    </div>
  </div>
</template>

<style scoped></style>
