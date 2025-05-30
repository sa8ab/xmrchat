<script lang="ts" setup>
import type { PageSettingField } from "~/types";
import { PageSettingKey } from "~/types/enums";

const url = useRequestURL();
const { state: authState } = useAuthStore();
const { t } = useI18n();

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
    const autoShowTips =
      settings.find(({ key }) => key === PageSettingKey.OBS_AUTO_SHOW_TIPS)
        ?.value ?? false;

    return {
      keepMessages,
      playSound,
      autoShowTips,
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
          value: false,
        },
        {
          key: PageSettingKey.OBS_AUTO_SHOW_TIPS,
          value: data.value?.autoShowTips,
        },
        { key: PageSettingKey.OBS_PLAY_SOUND, value: data.value?.playSound },
      ] as PageSettingField[],
    });

    toast.add({
      title: t("settingsAreUpdated"),
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
    <PageTitle :title="t('obs')" :description="t('obsDescription')" />
    <div class="flex flex-col items-start gap-2">
      <!-- <span class="font-bold text-lg">Get page</span> -->
      <span>
        {{ t("toUseXMRchatsOnOBS") }}
      </span>
      <UButton icon="i-heroicons-document-duplicate" @click="copyLink">
        {{ t("copyOBSLink") }}
      </UButton>
    </div>
    <UDivider class="my-6" />
    <div class="font-bold text-lg mb-4">{{ t("obsPageSettings") }}</div>

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
          <UToggle v-model="data.autoShowTips" @change="saveSettings"></UToggle>
        </div>
        <span class="font-bold cols"> {{ t("autoShowTips") }}</span>
        <span></span>
        <span class="text-pale text-sm">
          {{ t("autoShowTipsDescription") }}
        </span>
      </div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
        <div>
          <UToggle v-model="data.playSound" @change="saveSettings"></UToggle>
        </div>
        <span class="font-bold cols">{{ t("playSound") }}</span>
        <span></span>
        <span class="text-pale text-sm">
          {{ t("playSoundDescription") }}
        </span>
        <template v-if="data.playSound">
          <span></span>
          <UAlert
            :ui="{ description: 'text-xs' }"
            color="primary"
            variant="soft"
            :description="t('playSoundDescriptionLocal')"
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
        :title="t('errorUpdatingSettings')"
      >
      </UAlert>
    </div>
    <!-- <div class="mt-6">
      <UButton :loading="state.saving" @click="saveSettings">{{
        t("saveChanges")
      }}</UButton>
    </div> -->
  </div>
</template>

<style scoped></style>
