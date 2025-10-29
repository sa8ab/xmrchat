<script setup lang="ts">
const { toStreamerCohostsInvites } = useRouteLocation();
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <h3 class="text-lg font-medium">You don't have any cohosts yet</h3>
    <div class="text-sm text-pale text-center">
      <p>Cohosts are users who can help you manage your xmrchats.</p>
      <p>You can invite cohosts using the button bellow.</p>
    </div>
    <UButton :to="toStreamerCohostsInvites()" variant="soft">
      Invite Cohosts
    </UButton>
  </div>
</template>
