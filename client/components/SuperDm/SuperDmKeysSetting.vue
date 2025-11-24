<script setup lang="ts">
import { UAlert, UFormGroup } from "#components";

const { getSavedKey, generateAndSaveKeys } = useSuperDm();
const toast = useToast();

interface State {
  code?: string;
  mode: "result" | "recovery";
  generateModal: boolean;
  loadingGenerate: boolean;
}

const state = reactive<State>({
  code: undefined,

  mode: "recovery",

  generateModal: false,
  loadingGenerate: false,
});

const {
  data: savedKey,
  pending,
  error,
} = useLazyAsyncData(
  async () => {
    const key = await getSavedKey();
    return key;
  },
  { server: false }
);

const handleGenerateClick = () => {
  state.generateModal = true;
};

const handleGenerate = async () => {
  state.generateModal = false;
  state.loadingGenerate = true;
  try {
    const keys = await generateAndSaveKeys();

    // save to idb

    // send public key to server

    console.log({ keys });
  } catch (error) {
    toast.add({ description: getErrorMessage(error) });
  } finally {
    state.loadingGenerate = false;
  }
};
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Encryption Keys</h3>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ getErrorMessage(error) }}</div>

    <template v-else>
      <div v-if="savedKey">
        <p>Backup your recovery code</p>
        <p>
          XMRChat only stores your public key. Your recovery code remains on
          your device.
        </p>
        <UInput :modelValue="savedKey || ''" readonly />
      </div>
      <div v-else-if="state.mode === 'recovery'">
        <UFormGroup label="Recovery Code">
          <template #description>
            <p>
              Enter your recovery code or generate new keys. You won't be able
              to decrypt your previous messages after generating new keys.
            </p>
          </template>
          <UInput v-model="state.code" />
        </UFormGroup>
        <div class="flex gap-2 pt-2">
          <UButton>Done</UButton>
          <UButton
            variant="ghost"
            @click="handleGenerateClick"
            :loading="state.loadingGenerate"
          >
            Generate new
          </UButton>
        </div>
      </div>
      <div v-else class="">Show new keys ask to save the recovery code.</div>
    </template>

    <UModal v-model="state.generateModal">
      <UCard>
        <template #header>
          <h2 class="text-lg font-medium">Generate new keys</h2>
        </template>

        <UAlert color="primary" variant="subtle">
          <template #description>
            If you generate new keys you will not be able to decrypt your
            previous messages. New messages will be encrypted with the new keys.
          </template>
        </UAlert>
        <div class="grid gap-2 mt-6">
          <p>
            If you forgot your recovery code or it is your first time using
            Super DM, you can generate new encryption keys.
          </p>
          <p>Click generate keys to setup the Super DM encryption.</p>
          <p class="pt-4 text-sm text-pale">
            Please be ready to save your recovery code.
          </p>
        </div>
        <template #footer>
          <div class="flex gap-2 justify-end">
            <UButton
              variant="ghost"
              color="red"
              @click="state.generateModal = false"
            >
              Cancel
            </UButton>
            <UButton @click="handleGenerate">Generate keys</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped></style>
