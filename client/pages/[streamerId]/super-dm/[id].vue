<script setup lang="ts">
import type { PageSetting, StreamerPage, SuperDm } from "~/types";
import * as openpgp from "openpgp";
import { PageSettingKey } from "~/types/enums";

const route = useRoute();
const { axios } = useApp();
const { getViewerSavedKey } = useSuperDm();

const superDmId = computed(() => route.params.id as string);
const pagePath = computed(() => route.params.streamerId as string);
const toast = useToast();

const message = ref<string>();
const loadingSendMessage = ref(false);

const { data, error, pending } = await useLazyAsyncData(
  async () => {
    // get super dm
    const superDmRequest = axios.get<{ superDm: SuperDm }>(
      `/super-dms/${superDmId.value}`
    );

    const pageRequest = axios.get<StreamerPage>(`/pages/${pagePath.value}`);

    const settingsRequest = await axios.get<{ settings: PageSetting[] }>(
      `/page-settings/${pagePath.value}/super-dm`
    );
    const publicKey = settingsRequest.data.settings.find(
      (s) => s.key === PageSettingKey.SUPER_DM_PUBLIC_KEY
    )?.value;

    const [superDm, page] = await Promise.all([superDmRequest, pageRequest]);

    return {
      superDm: superDm.data.superDm,
      page: page.data,
      settings: { publicKey },
    };
  },
  {
    server: false,
  }
);

if (error.value) {
  throw createError(error.value);
}

const { data: keys, refresh: refreshKeys } = await useLazyAsyncData(
  async () => {
    const keys = await getViewerSavedKey({
      pagePath: pagePath.value,
      superDmId: superDmId.value,
    });
    return keys;
  },
  { server: false }
);

const { init, sendMessage } = useSuperDmSocket();

const initSocket = () => {
  if (!data.value?.superDm || !keys.value) return;
  init(superDmId.value);
};

watch(
  [data, keys],
  () => {
    initSocket();
  },
  { immediate: true }
);

const handleSendMessage = async () => {
  loadingSendMessage.value = true;
  try {
    if (!keys.value?.publicKeyArmored || !data.value?.settings.publicKey)
      return;

    const superDmPublicKey = await openpgp.readKey({
      armoredKey: keys.value?.publicKeyArmored,
    });
    const streamerPublicKey = await openpgp.readKey({
      armoredKey: data.value?.settings.publicKey,
    });
    const superDmPrivateKey = await openpgp.readPrivateKey({
      armoredKey: keys.value?.privateKeyArmored,
    });

    const createdMessage = await openpgp.createMessage({ text: message.value });
    const date = new Date().toISOString();

    const encryptedMessageArmored = await openpgp.encrypt({
      message: createdMessage,
      encryptionKeys: [superDmPublicKey, streamerPublicKey],
    });

    const signatureObject = { armoredMessage: encryptedMessageArmored, date };
    const signatureText = JSON.stringify(signatureObject);
    const signatureMessage = await openpgp.createMessage({
      text: signatureText,
    });

    const signature = await openpgp.sign({
      message: signatureMessage,
      signingKeys: [superDmPrivateKey],
      detached: true,
    });

    await sendMessage({
      content: encryptedMessageArmored,
      date,
      signature,
      superDmId: superDmId.value,
    });
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  } finally {
    loadingSendMessage.value = false;
  }
};
</script>

<template>
  <div class="inner pt-4 pb-10">
    <template v-if="pending && !data">
      <!-- <SuperDmSkeleton /> -->
      Pending
    </template>
    <template v-else-if="error">
      <ErrorView :error="error" :showBackToHome="false" />z
    </template>
    <template v-else>
      <PageTitle
        :title="`Super DM - ${data?.superDm.name}`"
        description="Send super DM to the streamer"
      />
      <div v-if="!keys">
        <SuperDmKeysRecovery
          :superDmId="data?.superDm.id"
          :pagePath="pagePath"
          @recovered="refreshKeys"
        />
      </div>

      <div
        v-else
        class="flex justify-center h-screen max-h-[calc(100vh-300px)]"
      >
        <div
          class="grid grid-rows-[auto_1fr_auto] w-full max-w-[600px] ring-1 ring-border rounded-md"
        >
          <div class="flex gap-2 py-2 px-4 border-b border-border">
            <GeneralImage
              :url="data?.page.logo.url"
              variant="logo"
              class="w-10 h-10"
            />
            <div class="flex flex-col flex-1">
              <span>{{ data?.page.name || data?.page.path }}</span>
              <span class="text-sm text-pale">{{ data?.page.path }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-4 flex-grow p-6 overflow-y-auto">
            <SuperDmMessage
              v-for="x in 4"
              :side="x % 2 === 0 ? 'start' : 'end'"
              :showUser="x % 2 === 0"
            />
          </div>
          <div>
            <SuperDmMessageField v-model="message" @send="handleSendMessage" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
