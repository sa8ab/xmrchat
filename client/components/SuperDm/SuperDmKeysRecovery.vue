<script setup lang="ts">
import useVuelidate from "@vuelidate/core";

const props = defineProps<{
  superDmId?: string;
  pagePath?: string;
}>();

const emit = defineEmits<{
  recovered: [];
}>();

const state = reactive({
  recoveryKey: "",
});

const { recoverKeys, saveViewerKeys } = useSuperDm();

const { required } = useValidations();
const toast = useToast();

const handleRecover = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  try {
    const keys = recoverKeys(state.recoveryKey);
    console.log(keys);
    if (!props.superDmId || !props.pagePath) {
      throw createError("Super DM id and page path are required");
    }
    await saveViewerKeys({
      superDmId: props.superDmId,
      pagePath: props.pagePath,
      generatedKeys: keys,
    });

    emit("recovered");
  } catch (error) {
    toast.add({ description: getErrorMessage(error), color: "red" });
  }
};

const v = useVuelidate<any>(
  {
    recoveryKey: { required },
  },
  state
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div class="max-w-[600px] mx-auto grid gap-4">
    <p class="">
      The recovery keys are not saved on this browser. Please enter the mnemonic
      phrase for this Super DM to recover super dm messages.
    </p>
    <p class="">
      <span class="font-medium">Super DM id: </span>
      <span class="">{{ superDmId }}</span>
    </p>
    <GeneralForm>
      <UFormGroup
        label="Mnemonic phrase"
        :error="getValidationAttrs('recoveryKey').error"
      >
        <UInput
          v-model="state.recoveryKey"
          placeholder="Enter your mnemonic phrase"
          @blur="getValidationAttrs('recoveryKey').onBlur"
        />
      </UFormGroup>
      <div class="flex justify-center mt-4">
        <UButton @click="handleRecover">Recover</UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
