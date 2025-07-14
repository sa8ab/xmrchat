<script setup lang="ts">
import type { IntegrationConfigType } from "~/types/enums";

const props = defineProps<{
  integrationType: IntegrationConfigType;
}>();

const emit = defineEmits<{
  connect: [];
}>();

const { getIntegrationConfigType } = useConstants();

const integration = computed(() =>
  getIntegrationConfigType(props.integrationType)
);
</script>

<template>
  <UCard>
    <div
      v-if="integration.image"
      class="p-2 ring-1 rounded-md ring-border inline-flex"
    >
      <!-- image -->
      <UIcon :name="integration.image" size="32px" />
    </div>
    <div class="mt-2 flex justify-between items-center">
      <!-- header -->
      <h3 class="text-2xl font-medium">{{ integration.name }}</h3>
      <UButton
        color="gray"
        variant="link"
        :to="integration.link?.url"
        external
        :padded="false"
        target="_blank"
      >
        {{ integration.link?.label }}
        <template #trailing>
          <UIcon name="i-heroicons-arrow-top-right-on-square" />
        </template>
      </UButton>
    </div>
    <div class="pt-3">
      <!-- description -->
      <p class="text-pale">{{ integration.description }}</p>
    </div>
    <div>
      <!-- actions -->
    </div>
    <template #footer>
      <div class="flex justify-between items-center gap-2">
        <div>
          <slot name="info" />
        </div>
        <div>
          <UButton variant="soft" @click="emit('connect')">Connect</UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
