<script setup lang="ts">
const { toStreamerCohostsInvites } = useRouteLocation();
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <h3 class="text-lg font-medium">{{ $t("noCohosts") }}</h3>
    <div class="text-sm text-pale text-center">
      <p>{{ $t("cohostsCanHelpYou") }}</p>
      <p>{{ $t("youCanInviteCohosts") }}</p>
    </div>
    <UButton :to="toStreamerCohostsInvites()" variant="soft">
      {{ $t("inviteCohosts") }}
    </UButton>
  </div>
</template>
