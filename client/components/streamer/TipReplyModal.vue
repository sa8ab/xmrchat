<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import type { Tip, TipReply } from "~/types";

const props = defineProps<{
  tip?: Tip;
  tipReply?: TipReply;
  pending?: boolean;
}>();

const model = defineModel<boolean>();

const state = reactive<{
  message?: string;
  loading: boolean;
}>({
  message: undefined,
  loading: false,
});

const { axios } = useApp();
const toast = useToast();
const { required, maxLength } = useValidations();

const handleSubmit = async () => {
  state.loading = true;
  const tipreplyId = props.tipReply?.id;
  try {
    tipreplyId
      ? await axios.put(`/tip-replies/${tipreplyId}`, {
          message: state.message,
        })
      : await axios.post(`/tip-replies/${props.tip?.id}`, {
          message: state.message,
        });

    toast.add({
      description: "Reply sent successfully",
      color: "green",
    });
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loading = false;
  }
};

const reset = () => {
  v.value.$reset();
  state.message = undefined;
};

const v = useVuelidate<any>(
  {
    message: { required, maxLength: maxLength(255) },
  },
  computed(() => state),
);

const { getValidationAttrs } = useValidations(v);

watch(model, (v) => {
  if (v) reset();
});
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Reply</h2>
      </template>

      <div class="text-sm">
        <span class="text-pale">Reply to tip: </span>
        <span>{{ tip?.name }}</span>
      </div>

      <div class="text-sm mt-2">
        <span class="text-pale">Message: </span>
        <span>{{ tip?.message }}</span>
      </div>

      <UFormGroup
        class="mt-4"
        name="message"
        label="Reply message"
        :error="getValidationAttrs('message').error"
      >
        <UTextarea
          v-model="state.message"
          autoresize
          @blur="getValidationAttrs('message').onBlur"
        />
      </UFormGroup>

      <template #footer>
        <div class="flex items-center justify-between gap-2">
          <UButton color="red" variant="ghost">
            {{ $t("delete") }}
          </UButton>
          <div class="flex gap-2">
            <UButton variant="ghost" @click="model = false">
              {{ $t("cancel") }}
            </UButton>
            <UButton :loading="state.loading" @click="handleSubmit">
              {{ $t("save") }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
