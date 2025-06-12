<script lang="ts" setup>
import type { TipCreationResponse } from "~/types";

const props = defineProps<{
  createdTip?: TipCreationResponse;
  connectionStatus?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  retry: [];
}>();
</script>

<template></template>
