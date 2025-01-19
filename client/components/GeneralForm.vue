<script lang="ts" setup></script>

<template>
  <form @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<style scoped></style>
