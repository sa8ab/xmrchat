<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { Numberic, PageSetting } from "~/types";
import { PageSettingKey } from "~/types/enums";

interface State {
  form: {
    minSuperDmAmount?: Numberic;
    superDmActive?: boolean;
  };
  loadingSave: boolean;
}

const { required, numberic } = useValidations();
const { axios } = useApp();
const toast = useToast();

const state = reactive<State>({
  form: {
    minSuperDmAmount: undefined,
    superDmActive: false,
  },
  loadingSave: false,
});

useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ settings: PageSetting[] }>(
      `/super-dm/settings`
    );
    const active = data.settings.find(
      (s) => s.key === PageSettingKey.SUPERDM_ACTIVE
    )?.value;
    const minAmount = data.settings.find(
      (s) => s.key === PageSettingKey.SUPER_DM_MIN_AMOUNT
    )?.value;

    state.form.superDmActive = active;
    state.form.minSuperDmAmount = minAmount;
  },
  { server: false }
);

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
    <GeneralForm>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UFormGroup
          label="Super DM activation"
          name="superDmActive"
          description="Activate or deactivate Super DMs."
        >
          <UToggle v-model="state.form.superDmActive" size="lg" />
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
