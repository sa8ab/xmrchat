<script setup lang="ts">
import type { SuperDm } from "~/types";

definePageMeta({
  hideSuperDmList: true,
});

const route = useRoute();
const { axios } = useApp();
const toast = useToast();

const { getStreamerSavedKey } = useSuperDm();

const messageRef = ref<string>();
const loadingSendMessage = ref(false);

const superDmId = computed(() => route.params.id as string);

const { data, error, pending } = useLazyAsyncData(
  `super-dm-${superDmId.value}`,
  async () => {
    const { data } = await axios.get<{ superDm: SuperDm }>(
      `/super-dms/${superDmId.value}`
    );

    return data;
  },
  { server: false }
);

const { data: keys, refresh: refreshKeys } = await useLazyAsyncData(
  `streamer-super-dm-keys`,
  async () => {
    return await getStreamerSavedKey();
  },
  { server: false }
);
</script>

<template>
  <div>
    <template v-if="pending && !data">
      <SuperDmSkeleton />
    </template>
    <template v-else-if="error">
      <ErrorView :error="error" :showBackToHome="false" />
    </template>
    <div v-else>
      <div class="flex justify-center h-screen max-h-[calc(100vh-300px)]">
        <div
          class="grid grid-rows-[auto_1fr_auto] w-full ring-1 ring-border rounded-md"
        >
          <div class="flex gap-2 py-2 px-4 border-b border-border">
            image
            <div class="flex flex-col flex-1">
              <span>{{ data?.superDm.name }}</span>
              <span class="text-sm text-pale"
                >{{ unitsToXmr(data?.superDm.payment?.amount) }} XMR</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-4 flex-grow p-6 overflow-y-auto">
            <SuperDmMessage
              v-for="message in data?.superDm.messages"
              :message="message"
              :privateKey="keys?.privateKeyArmored"
            />
          </div>
          <div>
            <SuperDmMessageField v-model="messageRef" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
