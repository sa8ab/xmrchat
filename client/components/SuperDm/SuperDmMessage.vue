<script setup lang="ts">
import type { SuperDmMessage } from "~/types";
import { SuperDmMessageSenderTypeEnum } from "~/types/enums";

const props = withDefaults(
  defineProps<{
    message?: SuperDmMessage;
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

const decryptContent = () => {};
</script>

<template>
  <div :class="['flex items-start gap-2.5', wrapperClass]">
    <div v-if="showUser">
      <img
        class="w-8 h-8 rounded-full object-cover ring-1 ring-border"
        src="/images/xmrchat-logo.png"
        alt="Jese image"
      />
    </div>
    <div
      :class="[
        'flex flex-col w-full leading-1.5 p-4 border border-border rounded-md max-w-[380px]',
        colorClass,
      ]"
    >
      <p class="">{{ message?.content }}</p>
      <div :class="['flex pt-2 justify-end']">
        <span class="text-xs text-pale">{{
          dayjs(message?.createdAt).format("L")
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
