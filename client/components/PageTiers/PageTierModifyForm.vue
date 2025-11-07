<script setup lang="ts">
import { UFormGroup } from "#components";
import useVuelidate from "@vuelidate/core";
import type { UploadedFile } from "~/types";
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
}

const { PAGE_TIER_COLORS } = useConstants();
const { required, maxLength, numberic } = useValidations();

const state: State = reactive({
  form: {
    name: undefined,
    description: undefined,
    minAmount: undefined,
    color: undefined,

    soundId: undefined,
  },
  sound: undefined,
});

const handleSubmit = () => {};

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
  <div class="flex justify-center">
    <GeneralForm
      @submit="handleSubmit"
      class="flex gap-4 flex-col w-full max-w-[600px]"
    >
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
          v-model="state.form.name"
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
                  getForegroundColor(`rgb(${item})`) === 'white'
                    ? 'text-white'
                    : 'text-black',
                ]"
                :style="{ backgroundColor: `rgb(${item})` }"
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
        <UButton type="submit">Save</UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
