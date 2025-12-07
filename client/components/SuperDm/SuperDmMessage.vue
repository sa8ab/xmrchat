<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: any;
    side?: "start" | "end";
    showUser?: boolean;
  }>(),
  {
    side: "start",
    showUser: true,
  }
);

const wrapperClass = computed(() => {
  return props.side === "start" ? "flex-row" : "flex-row-reverse";
});

const colorClass = computed(() => {
  return props.side === "start" ? undefined : "bg-background-2";
});
</script>

<template>
  <div :class="['flex items-start gap-2.5', wrapperClass]">
    <div v-if="showUser">
      <img
        class="w-8 h-8 rounded-full object-cover ring-1 ring-border"
        src="/images/xmrchat-logo.png"
        alt="Jese image"
      />
    </div>
    <div
      :class="[
        'flex flex-col w-full leading-1.5 p-4 border border-border rounded-md max-w-[380px]',
        colorClass,
      ]"
    >
      <p class="">Some message text here...</p>
      <div :class="['flex pt-2 justify-end']">
        <span class="text-xs text-pale">local date</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
