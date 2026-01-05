<script setup lang="ts">
import type { ContentLink } from "~/types";
import { ContentLinkPlatformEnum } from "~/types/enums";

const { axios } = useApp();
const route = useRoute();
const type = computed(() => route.params.type as ContentLinkPlatformEnum);
const { getContentLink } = useConstants();

const { data, pending, refresh, error } = await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ link: ContentLink }>(
      `/links/${type.value}`
    );
    return data.link;
  },
  { server: false }
);
</script>

<template>
  <PageTitle :title="`${getContentLink(type)?.name || '-'} Link`" />

  <div v-if="pending && !data"></div>
  <div v-else-if="error || !data || !data.value">
    <UAlert color="red" variant="subtle">
      <template #title> Link not found </template>
      <template #description>
        Link not found, please add and save the link first.
      </template>
    </UAlert>
  </div>
  <div v-else>
    <template v-if="data.verification">
      Verification
      <pre>{{ data.verification }}</pre>
    </template>
    <template v-else>
      <XVerification v-if="type === ContentLinkPlatformEnum.X" />
      <div v-else>Verification is not supported for this link.</div>
    </template>
  </div>
</template>

<style scoped></style>
