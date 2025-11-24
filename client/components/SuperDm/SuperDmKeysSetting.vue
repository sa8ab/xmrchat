<script setup lang="ts">
import { UAlert, UFormGroup } from "#components";

const { getSavedKey, generateAndSaveKeys } = useSuperDm();
const toast = useToast();

interface State {
  code?: string;
  generateModal: boolean;
  loadingGenerate: boolean;
  generatedResult: any;
}

const state = reactive<State>({
  code: undefined,
  generateModal: false,
  loadingGenerate: false,

  generatedResult: undefined,
});

const {
  data: savedKeys,
  pending,
  error,
  refresh,
} = useLazyAsyncData(
  async () => {
    const keys = await getSavedKey();
    return keys;
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

    // send public key to server

    // refresh();

    state.generatedResult = keys;

    console.log({ keys });
  } catch (error) {
    toast.add({ description: getErrorMessage(error) });
  } finally {
    state.loadingGenerate = false;
  }
};

const handleSaveRecoveryCode = async () => {
  await refresh();
  state.generatedResult = undefined;
};
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Encryption Keys</h3>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ getErrorMessage(error) }}</div>

    <template v-else>
      <div v-if="savedKeys" class="flex flex-col gap-2">
        <h3 class="font-medium">Backup your recovery code</h3>
        <p>
          XMRChat only stores your public key. Your recovery code remains on
          your device.
        </p>
        <UInput :modelValue="savedKeys?.mnemonic" readonly />
      </div>
      <div v-else-if="!state.generatedResult">
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
      <div v-else class="grid gap-2">
        <p>
          Please save your recovery code. You will need the recovery code to
          access your encrypted messages. If you clear cache or use different
          device you will need to enter the recovery code.
        </p>
        <UInput
          :modelValue="state.generatedResult?.mnemonic"
          readonly
          size="lg"
        />
        <div>
          <UButton @click="handleSaveRecoveryCode">
            I saved the recovery code
          </UButton>
        </div>
      </div>
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
