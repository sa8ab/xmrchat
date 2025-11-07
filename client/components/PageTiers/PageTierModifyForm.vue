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
    color?: string;
    soundId?: number;
  };
  sound?: UploadedFile;
  loading: boolean;
}

const { PAGE_TIER_COLORS } = useConstants();
const { required, maxLength, numberic } = useValidations();
const { toStreamerPageTiers } = useRouteLocation();
const { axios } = useApp();
const route = useRoute();
const id = computed(() => route.params.id as string);
const toast = useToast();

const state: State = reactive({
  form: {
    name: undefined,
    description: undefined,
    minAmount: undefined,
    color: undefined,

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
      description: id.value ? "Page tier updated." : "Page tier created.",
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

const v = useVuelidate<any>(
  {
    name: { required, maxLength: maxLength(40) },
    minAmount: { numberic },
  },
  computed(() => state.form)
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <GeneralForm @submit="handleSubmit">
    <div class="flex gap-4 flex-col w-full max-w-[600px] m-auto">
      <UFormGroup label="Name" :error="getValidationAttrs('name').error">
        <UInput
          v-model="state.form.name"
          @blur="getValidationAttrs('name').onBlur"
        />
      </UFormGroup>
      <UFormGroup
        label="Min. amount ( XMR )"
        :error="getValidationAttrs('minAmount').error"
      >
        <UInput
          v-model="state.form.minAmount"
          @blur="getValidationAttrs('minAmount').onBlur"
        />
      </UFormGroup>
      <UFormGroup label="Sound ( OBS )">
        <FileUploader
          :slug="UploadSlug.OBS_SOUND"
          accept="audio/*"
          @upload="handleSoundUpload"
        />
        <div v-if="state.sound" class="flex gap-2 items-center pt-2">
          <span class="text-pale text-xs truncate max-w-[240px]">
            Uploaded: {{ state.sound.originalName }}
          </span>
          <UButton
            variant="soft"
            color="red"
            size="xs"
            @click="handleClearSound"
          >
            Clear
          </UButton>
        </div>
      </UFormGroup>
      <UFormGroup label="Color">
        <div class="flex gap-2 flex-wrap">
          <URadio
            v-for="item in PAGE_TIER_COLORS"
            :value="item"
            v-model="state.form.color"
            inputClass="hidden"
            :ui="{ inner: 'ms-0', label: 'flex' }"
          >
            <template #label>
              <span
                :class="[
                  'w-6 h-6 rounded-full inline-flex items-center justify-center ring-2 ring-border',
                  getForegroundColor(item) === 'white'
                    ? 'text-white'
                    : 'text-black',
                ]"
                :style="{ backgroundColor: item }"
              >
                <UIcon
                  v-if="state.form.color === item"
                  name="i-heroicons-check"
                  size="20"
                />
              </span>
            </template>
          </URadio>
        </div>
      </UFormGroup>
      <div class="mt-4">
        <UButton type="submit" :loading="state.loading">Save</UButton>
      </div>
    </div>
  </GeneralForm>
</template>

<style scoped></style>
