<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { PaidContent } from "~/types";

interface State {
  form: {
    name?: string;
    description?: string;
    amount?: string;
    duration?: number;
  };
  loading: boolean;
}

const route = useRoute();
const toast = useToast();
const { axios } = useApp();
const { required, numberic, maxLength } = useValidations();
const { toStreamerPaidContents } = useRouteLocation();
const {
  PAID_CONTENT_DURATIONS: durations,
  getPaidContentDuration: getDuration,
} = useConstants();

const id = computed(() => route.params.id as string);

const state: State = reactive({
  form: {
    name: undefined,
    description: undefined,
    amount: undefined,
    duration: undefined,
  },
  loading: false,
});

useLazyAsyncData(
  async () => {
    if (!id.value) return;
    const { data } = await axios.get<{ paidContent: PaidContent }>(
      `/paid-content/${id.value}`,
    );
    state.form.name = data.paidContent.name;
    state.form.description = data.paidContent.description;
    state.form.amount = data.paidContent.amount;
    state.form.duration = data.paidContent.duration;
  },
  { server: false },
);

const durationOptions = computed(() => {
  return Object.values(durations).map((v) => ({
    label: v.label,
    value: v.days,
  }));
});

const handleSubmit = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  state.loading = true;

  try {
    const { data } = id.value
      ? await axios.put(`/paid-content/${id.value}`, state.form)
      : await axios.post("/paid-content", state.form);

    await navigateTo(toStreamerPaidContents());
  } catch (error) {
    toast.add({ description: getErrorMessage(error) });
  } finally {
    state.loading = false;
  }
};

const v = useVuelidate<any>(
  {
    name: { required, maxLength: maxLength(20) },
    amount: { required, numberic },
    duration: { required },
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
      <UFormGroup
        label="Amount ( XMR )"
        :error="getValidationAttrs('amount').error"
      >
        <UInput
          v-model="state.form.amount"
          @blur="getValidationAttrs('amount').onBlur"
        />
      </UFormGroup>

      <UFormGroup
        label="Duration"
        :error="getValidationAttrs('duration').error"
      >
        <USelectMenu
          v-model="state.form.duration"
          :options="durationOptions"
          valueAttribute="value"
          optionAttribute="label"
          @blur="getValidationAttrs('duration').onBlur"
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
