<script setup lang="ts">
import useVuelidate from "@vuelidate/core";

const props = defineProps<{
  pagePath?: string;
}>();
const model = defineModel<boolean>();

const { axios } = useApp();
const { required } = useValidations();
const toast = useToast();
const { validateSamePrivateKeys, saveViewerKeys } = useSuperDm();

const state = reactive({
  superDmId: "",
  recoveryCode: "",
});

const handleHide = () => {
  model.value = false;
};

const handleRecover = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  try {
    const { data } = await axios.get(`/super-dms/${state.superDmId}`);
    if (!data.superDm) {
      throw createError("Super DM not found");
    }
    const samePrivateKeys = await validateSamePrivateKeys(
      data.superDm.publicKey,
      state.recoveryCode
    );
    if (!samePrivateKeys) {
      throw createError("Invalid recovery code");
    }

    if (!props.pagePath) {
      throw createError("Page path is required");
    }

    await saveViewerKeys({
      superDmId: state.superDmId,
      pagePath: props.pagePath,
      generatedKeys: data.superDm.keys,
    });
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  }
};

const v = useVuelidate<any>(
  {
    superDmId: { required },
    recoveryCode: { required },
  },
  state
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <h2 class="text-lg font-medium">Recover Super DM</h2>
      </template>
      <div class="grid gap-2">
        <p>
          Enter the Super DM id and recovery code of the Super DM you want to
          recover.
        </p>

        <UFormGroup
          label="Super DM id"
          :error="getValidationAttrs('superDmId').error"
        >
          <UInput
            v-model="state.superDmId"
            @blur="getValidationAttrs('superDmId').onBlur"
          />
        </UFormGroup>
        <UFormGroup
          label="Recovery code"
          :error="getValidationAttrs('recoveryCode').error"
        >
          <UInput
            v-model="state.recoveryCode"
            @blur="getValidationAttrs('recoveryCode').onBlur"
          />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="handleHide">Cancel</UButton>
          <UButton @click="handleRecover">Recover</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
