<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { Numberic } from "~/types";

interface State {
  form: {
    minSuperDmAmount?: Numberic;
    active?: boolean;
  };
  loadingSave: boolean;
}

const { required, numberic } = useValidations();
const { axios } = useApp();
const toast = useToast();

const state = reactive<State>({
  form: {
    minSuperDmAmount: undefined,
    active: undefined,
  },
  loadingSave: false,
});

const handleSubmit = async () => {
  const valid = await v.value.$validate();

  if (!valid) return;

  try {
    state.loadingSave = true;
    await axios.put("/super-dm/settings", state.form);
    toast.add({ description: "Super DM settings updated" });
  } catch (error) {
    toast.add({ description: getErrorMessage(error) });
  } finally {
    state.loadingSave = false;
  }
};

const v = useVuelidate<State["form"]>(
  computed(() => ({
    minSuperDmAmount: { required, numberic },
  })),
  computed(() => state.form)
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <PageTitle
      title="Super DM Settings"
      description="Configure your Super DM settings"
    ></PageTitle>

    <GeneralForm>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UFormGroup
          label="Super DM activation"
          name="active"
          description="Activate or deactivate Super DMs."
        >
          <UToggle v-model="state.form.active" size="lg" />
        </UFormGroup>
        <UFormGroup
          label="Min. Super DM amount ( XMR )"
          name="minSuperDmAmount"
          :error="getValidationAttrs('minSuperDmAmount').error"
          help="The minimum amount a fan needs to send to you to start a Super DM."
        >
          <UInput
            v-model="state.form.minSuperDmAmount"
            @blur="getValidationAttrs('minSuperDmAmount').onBlur"
          >
          </UInput>
        </UFormGroup>
        <SuperDmKeysSetting class="col-span-full" />
      </div>
      <div class="flex pt-6">
        <UButton :loading="state.loadingSave" @click="handleSubmit">
          Save
        </UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
