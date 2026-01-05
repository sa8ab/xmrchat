<script setup lang="ts">
import type { ContentLink } from "~/types";
import type { ContentLinkPlatformEnum } from "~/types/enums";

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
  <ErrorView :error="error" v-else-if="error" />
  <div v-else>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped></style>
