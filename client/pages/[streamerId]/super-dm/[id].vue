<script setup lang="ts">
const route = useRoute();
const { axios } = useApp();
const superDmId = computed(() => route.params.id as string);
</script>

<template>
  <div class="inner"></div>
</template>
