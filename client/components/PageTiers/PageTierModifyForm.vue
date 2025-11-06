<script setup lang="ts">
import { UFormGroup } from "#components";
import type { UploadedFile } from "~/types";

interface State {
  form: {
    name?: string;
    description?: string;
    minAmount?: number;
    color?: string;
    soundId?: string;
  };
  sound?: UploadedFile;
}

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
</script>

<template>
  <div class="flex justify-center">
    <GeneralForm
      @submit="handleSubmit"
      class="flex gap-4 flex-col w-full max-w-[600px]"
    >
      <UFormGroup label="Name">
        <UInput v-model="state.form.name" />
      </UFormGroup>
      <UFormGroup label="Min. amount ( XMR ) ">
        <UInput v-model="state.form.name" />
      </UFormGroup>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
