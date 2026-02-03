<script setup lang="ts">
import { UFormGroup } from "#components";
import useVuelidate from "@vuelidate/core";
import type { PageTipTier, UploadedFile } from "~/types";
import { UploadSlug } from "~/types/enums";

interface State {
  form: {
    name?: string;
    description?: string;
    minAmount?: number;
    messageLength?: number;
    color?: string;
    soundId?: number;
  };
  sound?: UploadedFile;
  loading: boolean;
}

const { getPageTierColorsList } = useConstants();
const { required, maxLength, numberic, integer, maxValue } = useValidations();
const { toStreamerPageTiers } = useRouteLocation();
const { axios } = useApp();
const route = useRoute();
const id = computed(() => route.params.id as string);
const toast = useToast();
const { t } = useI18n();

const state: State = reactive({
  form: {
    name: undefined,
    description: undefined,
    minAmount: undefined,
    color: undefined,
    messageLength: undefined,
    soundId: undefined,
  },
  sound: undefined,
  loading: false,
});

useLazyAsyncData(
  async () => {
    if (!id.value) return;
    const { data } = await axios.get<{ pageTipTier: PageTipTier }>(
      `/page-tip-tiers/${id.value}`
    );
    state.form.name = data.pageTipTier.name;
    state.form.description = data.pageTipTier.description;
    state.form.minAmount = data.pageTipTier.minAmount;
    state.form.color = data.pageTipTier.color;
    state.form.messageLength = data.pageTipTier.messageLength;
    state.form.soundId = data.pageTipTier.sound?.id;
    state.sound = data.pageTipTier.sound;
  },
  { server: false }
);

const handleSubmit = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  state.loading = true;
  try {
    const request = id.value
      ? axios.put(`/page-tip-tiers/${id.value}`, state.form)
      : axios.post(`/page-tip-tiers`, state.form);

    await request;
    toast.add({
      description: id.value ? t("pageTierUpdated") : t("pageTierCreated"),
    });
    await navigateTo(toStreamerPageTiers());
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
    });
  } finally {
    state.loading = false;
  }
};

const handleSoundUpload = (file: UploadedFile) => {
  state.form.soundId = file.id;
  state.sound = file;
};

const handleClearSound = () => {
  state.form.soundId = undefined;
  state.sound = undefined;
};

const resetColor = () => {
  // @ts-ignore
  state.form.color = null;
};
const v = useVuelidate<any>(
  {
    name: { required, maxLength: maxLength(20) },
    description: { maxLength: maxLength(255) },
    minAmount: { numberic, required },
    messageLength: { integer, maxValue: maxValue(1000) },
  },
  computed(() => state.form)
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <GeneralForm @submit="handleSubmit">
    <div class="flex gap-4 flex-col w-full max-w-[600px] m-auto">
      <UFormGroup :label="$t('name')" :error="getValidationAttrs('name').error">
        <UInput
          v-model="state.form.name"
          @blur="getValidationAttrs('name').onBlur"
        />
      </UFormGroup>
      <UFormGroup
        :label="$t('minAmountXMR')"
        :error="getValidationAttrs('minAmount').error"
      >
        <UInput
          v-model="state.form.minAmount"
          @blur="getValidationAttrs('minAmount').onBlur"
        />
      </UFormGroup>
      <UFormGroup
        label="Message length limit"
        :error="getValidationAttrs('messageLength').error"
      >
        <template #hint>
          <span class="text-xs"> Optional </span>
        </template>
        <UInput
          v-model="state.form.messageLength"
          @blur="getValidationAttrs('messageLength').onBlur"
        />
      </UFormGroup>
      <UFormGroup
        :label="$t('description')"
        :error="getValidationAttrs('description').error"
      >
        <UTextarea
          v-model="state.form.description"
          @blur="getValidationAttrs('description').onBlur"
        />
      </UFormGroup>
      <UFormGroup :label="$t('soundOBS')">
        <FileUploader
          :slug="UploadSlug.OBS_SOUND"
          accept="audio/*"
          @upload="handleSoundUpload"
        />
        <div v-if="state.sound" class="flex gap-2 items-center pt-2">
          <span class="text-pale text-xs truncate max-w-[240px]">
            {{ $t("uploaded") }} {{ state.sound.originalName }}
          </span>
          <UButton
            variant="soft"
            color="red"
            size="xs"
            @click="handleClearSound"
          >
            {{ $t("clear") }}
          </UButton>
        </div>
      </UFormGroup>
      <UFormGroup :label="$t('color')">
        <div class="flex gap-2 flex-wrap items-center">
          <URadio
            v-for="item in getPageTierColorsList()"
            :value="item.color"
            v-model="state.form.color"
            inputClass="w-0 h-0 opacity-0"
            name="color"
            :ui="{ inner: 'ms-0', label: 'flex' }"
          >
            <template #label>
              <span
                :class="[
                  'w-6 h-6 rounded-full inline-flex items-center justify-center ring-2 ring-border',
                  getForegroundColor(item.color) === 'white'
                    ? 'text-white'
                    : 'text-black',
                ]"
                :style="{ backgroundColor: item.color }"
              >
                <UIcon
                  v-if="state.form.color === item.color"
                  name="i-heroicons-check"
                  size="20"
                />
              </span>
            </template>
          </URadio>
          <UButton
            variant="ghost"
            color="red"
            class="p-1 rounded-full"
            square
            @click="resetColor"
          >
            <UIcon name="i-heroicons-x-mark-solid" size="20" />
          </UButton>
        </div>
      </UFormGroup>
      <div class="mt-4">
        <UButton type="submit" :loading="state.loading">{{
          $t("save")
        }}</UButton>
      </div>
    </div>
  </GeneralForm>
</template>

<style scoped></style>
