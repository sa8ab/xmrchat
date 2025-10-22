<script setup lang="ts">
import type { User } from "~/types";
const { toStreamerCohostsInvites } = useRouteLocation();

const { axios } = useApp();

const { data, pending, error } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ cohosts: User[] }>("/cohosts");
    return data.cohosts;
  },
  { server: false }
);
</script>

<template>
  <div>
    <!-- TODO: Add button to invites page -->
    <UButton :to="toStreamerCohostsInvites()">Invite Cohosts</UButton>

    <div v-if="pending">
      pending
      <!-- TODO: Add skeleton -->
    </div>
    <div v-else-if="error">
      <UAlert
        :description="getErrorMessage(error)"
        title="Error"
        color="red"
        variant="subtle"
      ></UAlert>
    </div>
    <div v-else-if="!data?.length">
      <NoCohosts />
    </div>
    <div v-else class="grid gap-2">
      <pre>{{ data }}</pre>
      <!-- <CohostItem v-for="cohost in data" :cohost="cohost" /> -->
    </div>
  </div>
</template>
