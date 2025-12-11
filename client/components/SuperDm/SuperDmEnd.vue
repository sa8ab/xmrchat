<script setup lang="ts">
import { ConfirmModal } from "#components";
import type { SuperDm } from "~/types";
import { SuperDmMessageSenderTypeEnum } from "~/types/enums";
import * as openpgp from "openpgp";

const props = defineProps<{
  superDm?: SuperDm;
  privateKeyArmored?: string;
}>();

const emit = defineEmits<{
  ended: [];
}>();

const modal = useModal();
const { axios } = useApp();
const toast = useToast();
const { dayjs } = useDate();

const loading = ref(false);

const handleEndSuperDmClick = async () => {
  const confirmModal = modal.open(ConfirmModal, {
    title: "End Super DM",
    text: "The messages can not be sent in super dm after it is ended.",
    color: "red",
    onConfirm: () => {
      handleEndSuperDm();
    },
  });
};

const handleEndSuperDm = async () => {
  try {
    loading.value = true;

    const privateKeyArmored = props.privateKeyArmored;

    if (!privateKeyArmored) throw createError("Private key is not found");

    const privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored,
    });

    const date = new Date().toISOString();

    const signatureMessage = await openpgp.createMessage({
      text: JSON.stringify({ date }),
    });

    const signature = await openpgp.sign({
      message: signatureMessage,
      signingKeys: [privateKey],
      detached: true,
    });

    await axios.put(`/super-dms/${props.superDm?.id}/end`, {
      endedByType: SuperDmMessageSenderTypeEnum.CREATOR,
      date,
      signature,
    });
    emit("ended");

    toast.add({ description: "Super DM ended successfully", color: "green" });
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    v-if="superDm?.endedAt"
    class="text-xs text-pale flex flex-col items-end"
  >
    <span> Ended at </span>
    <span>
      {{ dayjs(superDm.endedAt).format("L LT") }}
    </span>
  </div>
  <UButton
    v-else
    color="red"
    variant="soft"
    size="xs"
    :loading="loading"
    @click="handleEndSuperDmClick"
  >
    End Super DM
  </UButton>
</template>

<style scoped></style>
