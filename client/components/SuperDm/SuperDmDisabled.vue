<script setup lang="ts">
const { toStreamerSuperDmSettings } = useRouteLocation();
</script>

<template>
  <div class="flex flex-col items-center mt-6">
    <h3 class="text-lg font-medium text-center">
      Super DM settings are not enabled.
    </h3>
    <p class="text-pale text-center pt-2">
      Enabling SuperDMs will allow fans to pay you an amount you choose for the
      ability to start a private conversation with you. This is an end to end
      encrypted chat between you and the fan, no one else sees these messages
      (not even us!). Notifications need to be enabled for this feature so you
      are notified when a SuperDM arrives. Please respond quickly to your fans.
    </p>
    <div class="mt-4">
      <UButton :to="toStreamerSuperDmSettings()"> Configure Super DMs </UButton>
    </div>
  </div>
</template>

<style scoped></style>
