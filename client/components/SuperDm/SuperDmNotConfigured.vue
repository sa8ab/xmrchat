<script setup lang="ts">
const props = defineProps<{
  settingsConfigured?: boolean;
  notificationsActive?: boolean;
}>();

const { toStreamerSuperDmSettings, toStreamerNotificationPreferences } =
  useRouteLocation();
</script>

<template>
  <div class="flex flex-col items-center mt-6">
    <h3 class="text-lg font-medium text-center inline-flex items-center gap-2">
      <UIcon name="i-heroicons-exclamation-triangle" size="22px" />
      <span> Super DMs are not configured. </span>
    </h3>
    <p class="text-pale text-center pt-2">
      Enabling SuperDMs will allow fans to pay you an amount you choose for the
      ability to start a private conversation with you. This is an end to end
      encrypted chat between you and the fan, no one else sees these messages
      (not even us!). Notifications need to be enabled for this feature so you
      are notified when a SuperDM arrives. Please respond quickly to your fans.
    </p>
    <div class="mt-4 flex gap-2 flex-wrap">
      <UButton v-if="!settingsConfigured" :to="toStreamerSuperDmSettings()">
        Configure Super DMs
      </UButton>
      <UButton
        v-if="!notificationsActive"
        :to="toStreamerNotificationPreferences()"
      >
        Configure Notifications
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
