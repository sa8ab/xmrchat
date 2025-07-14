<script setup lang="ts">
import type { IntegrationConfigType } from "~/types/enums";

const props = defineProps<{
  integrationType: IntegrationConfigType;
}>();

const { getIntegrationConfigType } = useConstants();

const integration = computed(() =>
  getIntegrationConfigType(props.integrationType)
);
</script>

<template></template>
