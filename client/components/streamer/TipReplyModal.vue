<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import type { Tip, TipReply } from "~/types";

const props = defineProps<{
  tip?: Tip;
  tipReply?: TipReply;
  pending?: boolean;
}>();

const emit = defineEmits<{
  update: [];
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
  const valid = await v.value.$validate();
  if (!valid) return;

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
    emit("update");
    model.value = false;
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

const TIP_REPLY_MAX_LENGTH = 1000;

const v = useVuelidate<any>(
  {
    message: { required, maxLength: maxLength(TIP_REPLY_MAX_LENGTH) },
  },
  computed(() => state),
);

const { getValidationAttrs } = useValidations(v);

const messageLength = computed(() => state.message?.length || 0);

watch(model, (v) => {
  if (v) reset();
});
watch(
  () => props.tipReply,
  (v) => {
    if (v) state.message = v.message;
  },
);
</script>

<template>
  <UModal v-model="model" :ui="{ container: 'items-center' }" >
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
        :hint="`${messageLength} / ${TIP_REPLY_MAX_LENGTH}`"
      >
        <UTextarea
          v-model="state.message"
          autoresize
          @blur="getValidationAttrs('message').onBlur"
        />
      </UFormGroup>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="model = false">
            {{ $t("cancel") }}
          </UButton>
          <UButton :loading="state.loading" @click="handleSubmit">
            {{ $t("save") }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
