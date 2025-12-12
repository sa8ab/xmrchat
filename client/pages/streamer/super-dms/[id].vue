<script setup lang="ts">
import type { SuperDm } from "~/types";
import { SuperDmMessageSenderTypeEnum } from "~/types/enums";
import * as openpgp from "openpgp";
import { ConfirmModal } from "#components";

definePageMeta({
  hideSuperDmList: true,
});

const route = useRoute();
const { axios } = useApp();
const toast = useToast();
const modal = useModal();

const { getStreamerSavedKey, generateMessage, generateDateSignature } =
  useSuperDm();

const messageRef = ref<string>();
const loadingSendMessage = ref(false);
const loadingEndSuperDm = ref(false);

const superDmId = computed(() => route.params.id as string);

const { data, error, pending, refresh } = useLazyAsyncData(
  `super-dm-${superDmId.value}`,
  async () => {
    const { data } = await axios.get<{ superDm: SuperDm }>(
      `/super-dms/${superDmId.value}`
    );
    return data;
  },
  { server: false }
);

const { data: keys } = await useLazyAsyncData(
  `streamer-super-dm-keys`,
  async () => {
    return await getStreamerSavedKey();
  },
  { server: false }
);

const { init, streamerSendMessage, disconnect, readMessages } =
  useSuperDmSocket({
    handleSuperDmMessageEvent: (superDmMessage) => {
      if (data.value?.superDm.messages?.find((m) => m.id === superDmMessage.id))
        return;
      data.value?.superDm.messages?.push(superDmMessage);
      handleReadMessages();
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
};

const handleReadMessages = async () => {
  try {
    const { date, signature } = await generateDateSignature({
      privateKeyArmored: keys.value?.privateKeyArmored,
    });
    await readMessages({
      superDmId: superDmId.value,
      senderType: SuperDmMessageSenderTypeEnum.CREATOR,
      signature: signature,
      date: date,
    });
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  }
};

watch(
  [data, keys],
  () => {
    initSocket();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  disconnect();
});

const handleSendMessage = async () => {
  loadingSendMessage.value = true;
  const superDmPublicKeyArmored = data.value?.superDm.publicKey;

  const streamerPublicKeyArmored = keys.value?.publicKeyArmored;
  const streamerPrivateKeyArmored = keys.value?.privateKeyArmored;

  try {
    const message = await generateMessage({
      streamerPublicKeyArmored,
      superDmPublicKeyArmored,
      privateKeyArmored: streamerPrivateKeyArmored,
      message: messageRef.value,
    });

    await streamerSendMessage({
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
  <div>
    <template v-if="pending && !data">
      <SuperDmMessagesSkeleton />
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
            <div class="flex flex-col flex-1">
              <span class="inline-flex gap-1 items-center">
                <span>{{ data?.superDm.name }}</span>
              </span>
              <span class="text-xs text-pale">
                {{ unitsToXmr(data?.superDm.payment?.amount) }} XMR
              </span>
            </div>
            <div class="flex items-center">
              <SuperDmEnd
                :superDm="data?.superDm"
                :privateKeyArmored="keys?.privateKeyArmored"
                @ended="refresh"
              />
            </div>
          </div>
          <div class="flex flex-col gap-4 flex-grow p-6 overflow-y-auto">
            <SuperDmMessage
              v-for="message in data?.superDm.messages"
              :message="message"
              :privateKey="keys?.privateKeyArmored"
              :type="SuperDmMessageSenderTypeEnum.CREATOR"
            />
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
    </div>
  </div>
</template>

<style scoped></style>
