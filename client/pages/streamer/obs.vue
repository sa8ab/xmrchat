<script lang="ts" setup>
import type { PageSettingField } from "~/types";
import { PageSettingKey } from "~/types/enums";

const url = useRequestURL();
const { state: authState } = useAuthStore();

const { copy } = useCopy();
const {
  getPageSettings: getPageSettingsApi,
  updatePageSettings: updatePageSettingsApi,
} = useServices();
const toast = useToast();

const copyLink = () => {
  if (!authState.page) return;
  copy(`${url.origin}/${authState.page?.path}/obs`);
};

const { data, pending } = useLazyAsyncData(() => getPageSettingsApi(), {
  transform: (res) => {
    const settings = res.settings;

    const keepMessages =
      settings.find(({ key }) => key === PageSettingKey.OBS_KEEP_MESSAGES)
        ?.value ?? false;
    const playSound =
      settings.find(({ key }) => key === PageSettingKey.OBS_PLAY_SOUND)
        ?.value ?? false;

    return {
      keepMessages,
      playSound,
    };
  },
  server: false,
});

const state: { saving: boolean; saveError: string | undefined } = reactive({
  saving: false,
  saveError: undefined,
});

const saveSettings = async () => {
  try {
    if (!authState.page?.id) return;
    state.saveError = undefined;
    state.saving = true;
    await updatePageSettingsApi(authState.page?.id, {
      settings: [
        {
          key: PageSettingKey.OBS_KEEP_MESSAGES,
          value: data.value?.keepMessages,
        },
        { key: PageSettingKey.OBS_PLAY_SOUND, value: data.value?.playSound },
      ] as PageSettingField[],
    });

    toast.add({
      title: "Settings are updated.",
    });
  } catch (error) {
    state.saveError = getErrorMessage(error);
  } finally {
    state.saving = false;
  }
};
</script>

<template>
  <div>
    <PageTitle title="OBS" desciption="OBS widget and settings." />
    <div class="flex flex-col items-start gap-2">
      <!-- <span class="font-bold text-lg">Get page</span> -->
      <span>
        To use XMRChat on OBS, copy the link to OBS page and add it on "Browser"
        of OBS Sources.
      </span>
      <UButton icon="i-heroicons-document-duplicate" @click="copyLink">
        Copy OBS Page Link
      </UButton>
    </div>
    <UDivider class="my-6" />
    <div class="font-bold text-lg mb-4">OBS Page Settings</div>

    <div v-if="pending" class="flex flex-col gap-4">
      <div class="grid grid-cols-[auto_1fr] gap-x-2" v-for="x in 2">
        <div>
          <USkeleton class="h-4 w-[38px]" />
        </div>
        <span>
          <USkeleton class="h-4 max-w-[120px]" />
        </span>
        <span></span>
        <div class="mt-2">
          <USkeleton class="h-4 w-full max-w-[320px]" />
        </div>
      </div>
    </div>

    <div v-else-if="data" class="flex flex-col gap-4">
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
        <div>
          <UToggle v-model="data.keepMessages"></UToggle>
        </div>
        <span class="font-bold cols"
          >Prevent messages from fading away after 30 seconds.</span
        >
        <span></span>
        <span class="text-pale text-sm">
          When active, keeps the latest tips on the screen, otherwhise each
          message is displayed for 30 seconds.
        </span>
      </div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
        <div>
          <UToggle v-model="data.playSound"></UToggle>
        </div>
        <span class="font-bold cols">Play Sound</span>
        <span></span>
        <span class="text-pale text-sm">
          Plays a sound on the OBS page when new tip appears.
        </span>
        <template v-if="data.playSound">
          <span></span>
          <UAlert
            :ui="{ description: 'text-xs' }"
            color="primary"
            variant="soft"
            description="If you are testing this functionality locally in your browser, after opening the obs tab make sure to click somewhere on the page. Otherwhise browser won't play sound due to not having interactions with the opened tab."
            class="mt-2"
          />
        </template>
      </div>
    </div>
    <div class="mt-6">
      <UAlert
        v-if="state.saveError"
        color="red"
        :description="state.saveError"
        title="Error updating settings"
      >
      </UAlert>
    </div>
    <div class="mt-6">
      <UButton :loading="state.saving" @click="saveSettings"
        >Save Changes</UButton
      >
    </div>
  </div>
</template>

<style scoped></style>
