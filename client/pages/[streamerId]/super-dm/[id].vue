<script setup lang="ts">
import type { PageSetting, StreamerPage, SuperDm } from "~/types";
import * as openpgp from "openpgp";
import { PageSettingKey, SuperDmMessageSenderTypeEnum } from "~/types/enums";

const route = useRoute();
const { axios } = useApp();
const { getViewerSavedKey, generateMessage, generateDateSignature } =
  useSuperDm();

const bottomOfMessagesRef = ref<HTMLElement>();
const messagesContainerRef = ref<HTMLElement>();

const { scrollToBottom } = useSuperDmScroll({
  bottomOfMessagesRef: bottomOfMessagesRef,
  messagesContainerRef: messagesContainerRef,
});

const superDmId = computed(() => route.params.id as string);
const pagePath = computed(() => route.params.streamerId as string);
const pageName = computed(() => data.value?.page.name || data.value?.page.path);
const toast = useToast();

const messageRef = ref<string>();
const loadingSendMessage = ref(false);

const { data, error, pending, refresh } = await useLazyAsyncData(
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

const { init, sendMessage, readMessages, disconnect } = useSuperDmSocket({
  handleSuperDmMessageEvent: (superDmMessage) => {
    if (data.value?.superDm.messages?.find((m) => m.id === superDmMessage.id))
      return;
    data.value?.superDm.messages?.push(superDmMessage);
    handleReadMessages();
    scrollToBottom();
  },

  handleReadMessagesUpdatedEvent: (messages) => {
    data.value?.superDm.messages?.forEach((message) => {
      const updatedMessage = messages?.find((m) => m.id === message.id);
      if (updatedMessage) {
        message.read = updatedMessage.read;
      }
    });
  },
});

const initSocket = () => {
  if (!data.value?.superDm || !keys.value) return;
  init(superDmId.value);
  handleReadMessages();
  scrollToBottom({ ignoreBottom: true, behavior: "instant" });
};

watch(
  [data, keys],
  () => {
    initSocket();
  },
  { immediate: true }
);

const handleReadMessages = async () => {
  try {
    const { date, signature } = await generateDateSignature({
      privateKeyArmored: keys.value?.privateKeyArmored,
    });
    await readMessages({
      superDmId: superDmId.value,
      senderType: SuperDmMessageSenderTypeEnum.VIEWER,
      signature: signature,
      date: date,
    });
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  }
};

onBeforeUnmount(() => {
  disconnect();
});

const handleSendMessage = async () => {
  loadingSendMessage.value = true;

  // Should we use public key from settings?
  const superDmPublicKeyArmored = data.value?.settings.publicKey;
  const streamerPublicKeyArmored = keys.value?.publicKeyArmored;
  const streamerPrivateKeyArmored = keys.value?.privateKeyArmored;
  try {
    const message = await generateMessage({
      streamerPublicKeyArmored,
      superDmPublicKeyArmored,
      privateKeyArmored: streamerPrivateKeyArmored,
      message: messageRef.value,
    });

    await sendMessage({
      content: message.content,
      date: message.date,
      signature: message.signature,
      superDmId: superDmId.value,
    });

    messageRef.value = undefined;
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
      <SuperDmSkeleton />
    </template>
    <template v-else-if="error">
      <ErrorView :error="error" :showBackToHome="false" />
    </template>
    <template v-else>
      <PageTitle
        :title="`SuperDM - ${data?.superDm.name}`"
        :description="`Your private conversation with ${pageName} will continue until you or they end it by clicking End SuperDM.`"
      />
      <div v-if="!keys">
        <SuperDmKeysRecovery
          :superDmId="data?.superDm.id"
          :superDmPublicKeyArmored="data?.superDm.publicKey"
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
          <div
            class="flex gap-2 flex-wrap justify-between py-2 px-4 border-b border-border"
          >
            <div class="flex items-center gap-2">
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
            <div class="flex items-center gap-1 ms-auto">
              <SuperDmShowRecovery
                :pagePath="pagePath"
                :superDmId="data?.superDm.id"
              />
              <SuperDmEnd
                :superDm="data?.superDm"
                :privateKeyArmored="keys?.privateKeyArmored"
                :endedByType="SuperDmMessageSenderTypeEnum.VIEWER"
                @ended="refresh"
              />
            </div>
          </div>
          <div
            ref="messagesContainerRef"
            class="overflow-y-auto flex flex-1 flex-col"
          >
            <div class="flex flex-col gap-4 p-6">
              <SuperDmMessage
                v-for="message in data?.superDm.messages"
                :message="message"
                :page="data?.page"
                :privateKey="keys?.privateKeyArmored"
              />
            </div>

            <div ref="bottomOfMessagesRef"></div>
          </div>
          <div>
            <SuperDmMessageField
              v-model="messageRef"
              @send="handleSendMessage"
              :endedAt="data?.superDm.endedAt"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
