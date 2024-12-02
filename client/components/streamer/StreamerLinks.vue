<script lang="ts" setup>
const links = [
  { name: "X", icon: "i-tabler-brand-x" },
  {
    name: "Youtube",
    icon: "i-tabler-brand-youtube",
    classnames: "text-[#FF0000]",
  },
  {
    name: "Twitch",
    icon: "i-tabler-brand-twitch",
    classnames: "text-[#6441a5]",
  },
  {
    name: "Rumble",
    icon: "i-tabler-brand-rumble",
    classnames: "text-[#85c742]",
  },
];
</script>

<template>
  <div class="flex gap-4">
    <div v-for="item in links" class="flex flex-col items-center gap-1">
      <UIcon :name="item.icon" :class="['w-6 h-6', item.classnames]" />
      <span class="text-xs text-pale hidden lg:block">{{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped></style>
