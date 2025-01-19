<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<style scoped></style>
