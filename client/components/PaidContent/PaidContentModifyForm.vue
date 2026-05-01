<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { PaidContentDurationEnum } from "~/types/enums";

interface State {
  form: {
    name?: string;
    description?: string;
    amount?: number;
    duration?: PaidContentDurationEnum;
  };
  loading: boolean;
}

const { required, numberic, maxLength } = useValidations();

const state: State = reactive({
  form: {
    name: undefined,
    description: undefined,
    amount: undefined,
    duration: undefined,
  },
  loading: false,
});

const handleSubmit = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  state.loading = true;
};

const v = useVuelidate<any>(
  {
    name: { required, maxLength: maxLength(20) },
    amount: { required, numberic },
  },
  computed(() => state.form),
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
      <UFormGroup label="Amount" :error="getValidationAttrs('amount').error">
        <UInput
          v-model="state.form.amount"
          @blur="getValidationAttrs('amount').onBlur"
        />
      </UFormGroup>

      <!-- <UFormGroup
        :label="$t('description')"
        :error="getValidationAttrs('description').error"
      >
        <UTextarea
          v-model="state.form.description"
          @blur="getValidationAttrs('description').onBlur"
        />
      </UFormGroup> -->

      <div class="mt-4">
        <UButton type="submit" :loading="state.loading">{{
          $t("save")
        }}</UButton>
      </div>
    </div>
  </GeneralForm>
</template>

<style scoped></style>
