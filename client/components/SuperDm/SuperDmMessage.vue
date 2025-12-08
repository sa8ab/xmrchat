<script setup lang="ts">
import type { StreamerPage, SuperDmMessage } from "~/types";
import { SuperDmMessageSenderTypeEnum } from "~/types/enums";
import * as openpgp from "openpgp";

const props = withDefaults(
  defineProps<{
    message?: SuperDmMessage;
    page?: StreamerPage;
    privateKey?: string;
  }>(),
  {}
);

const { dayjs } = useDate();

const side = computed(() => {
  return props.message?.senderType === SuperDmMessageSenderTypeEnum.CREATOR
    ? "start"
    : "end";
});

const showUser = computed(() => {
  return props.message?.senderType === SuperDmMessageSenderTypeEnum.CREATOR;
});

const wrapperClass = computed(() => {
  return side.value === "start" ? "flex-row" : "flex-row-reverse";
});

const colorClass = computed(() => {
  return side.value === "start" ? undefined : "bg-background-2";
});

const {
  data: decryptedContent,
  error,
  pending,
} = useLazyAsyncData(
  `super-dm-message-${props.message?.id}`,
  async () => {
    const content = props.message?.content;
    if (!content || !props.privateKey)
      throw createError("Content or private key is missing");
    return await decryptContent(content, props.privateKey);
  },
  { server: false }
);

const decryptContent = async (content: string, privateKeyArmored: string) => {
  const message = await openpgp.readMessage({
    armoredMessage: content,
  });

  const privateKey = await openpgp.readPrivateKey({
    armoredKey: privateKeyArmored,
  });

  const decryptedContent = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decryptedContent.data;
};
</script>

<template>
  <div :class="['flex items-start gap-2.5', wrapperClass]">
    <div v-if="showUser">
      <GeneralImage class="w-8 h-8" :url="page?.logo.url" variant="logo" />
    </div>
    <div
      :class="[
        'flex flex-col w-full leading-1.5 p-4 border border-border rounded-md max-w-[380px]',
        colorClass,
      ]"
    >
      <div class="break-words">
        <div v-if="pending && !decryptedContent">Pending...</div>
        <div v-else>
          {{ decryptedContent || props.message?.content }}
        </div>

        <div v-if="error" class="text-red-500 pt-2">
          {{ getErrorMessage(error) }}
        </div>
      </div>
      <div :class="['flex pt-2 justify-end']">
        <span class="text-xs text-pale">{{
          dayjs(message?.createdAt).format("L LT")
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
