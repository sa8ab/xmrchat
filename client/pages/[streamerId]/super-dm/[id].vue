<script setup lang="ts">
import type { StreamerPage, SuperDm } from "~/types";

const route = useRoute();
const { axios } = useApp();
const { getViewerSavedKey } = useSuperDm();

const superDmId = computed(() => route.params.id as string);
const pagePath = computed(() => route.params.streamerId as string);

const { data, error, pending } = await useLazyAsyncData(
  async () => {
    // get super dm
    const superDmRequest = axios.get<{ superDm: SuperDm }>(
      `/super-dms/${superDmId.value}`
    );

    const pageRequest = axios.get<StreamerPage>(`/pages/${pagePath.value}`);

    const [superDm, page] = await Promise.all([superDmRequest, pageRequest]);

    // get keys for super dm
    const keys = await getViewerSavedKey({
      pagePath: pagePath.value,
      superDmId: superDmId.value,
    });

    return {
      superDm: superDm.data.superDm,
      page: page.data,
      keys,
    };
  },
  {
    server: false,
  }
);

if (error.value) {
  throw createError(error.value);
}
</script>

<template>
  <div class="inner pt-4 pb-10">
    <template v-if="pending && !data">
      <!-- <SuperDmSkeleton /> -->
      Pending
    </template>
    <template v-else-if="error">
      <ErrorView :error="error" :showBackToHome="false" />
    </template>
    <template v-else>
      <PageTitle
        :title="`Super DM - ${data?.superDm.name}`"
        description="Send super DM to the streamer"
      />
      <div class="flex justify-center h-screen max-h-[calc(100vh-300px)]">
        <div
          class="grid grid-rows-[1fr_auto] w-full max-w-[600px] ring-1 ring-border rounded-md"
        >
          <div class="flex flex-col gap-4 flex-grow p-6 overflow-y-auto">
            <SuperDmMessage
              v-for="x in 4"
              :side="x % 2 === 0 ? 'start' : 'end'"
              :showUser="x % 2 === 0"
            />
          </div>
          <div>
            <SuperDmMessageField />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
