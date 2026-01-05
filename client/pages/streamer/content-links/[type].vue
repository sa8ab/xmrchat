<script setup lang="ts">
import type { ContentLink } from "~/types";
import { ContentLinkPlatformEnum } from "~/types/enums";

const { axios } = useApp();
const route = useRoute();
const type = computed(() => route.params.type as ContentLinkPlatformEnum);
const { getContentLink } = useConstants();
const toast = useToast();

const pendingUnlink = ref(false);
const { data, pending, refresh, error } = await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ link: ContentLink }>(
      `/links/${type.value}`
    );
    return data.link;
  },
  { server: false }
);

const handleUnlink = async () => {
  try {
    pendingUnlink.value = true;
    await axios.delete(`/link-verifications/${type.value}`);
    toast.add({
      color: "green",
      title: "Account unlinked.",
    });
    await refresh();
  } catch (error) {
    toast.add({
      color: "red",
      title: getErrorMessage(error),
    });
  } finally {
    pendingUnlink.value = false;
  }
};
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
    <div v-if="data.verification">
      <p class="font-medium">
        Link is currently verified with the following URL:
        <UButton
          :to="data.verification.url"
          :padded="false"
          variant="link"
          external
          target="_blank"
        >
          {{ data.verification.url }} </UButton
        >.
      </p>
      <p class="mt-2">
        If you want to change the verification URL, please unlink the current
        URL and link the new one.
      </p>
      <UButton @click="handleUnlink" :loading="pendingUnlink" class="mt-4">
        Unlink Account
      </UButton>
    </div>
    <template v-else>
      <XVerification
        v-if="type === ContentLinkPlatformEnum.X"
        @verified="refresh"
      />
      <div v-else>Verification is not supported for this link.</div>
    </template>
  </div>
</template>

<style scoped></style>
