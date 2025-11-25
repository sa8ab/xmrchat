<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { Numberic } from "~/types";

interface State {
  form: {
    minSuperDmAmount?: Numberic;
    enabled?: boolean;
  };
}

const state = reactive<State>({
  form: {
    minSuperDmAmount: undefined,
    enabled: undefined,
  },
});

const { generateKeys } = useSuperDm();

const generateEncryptionKey = async () => {
  const result = generateKeys();
  console.log({ result });
};

const { required, numberic } = useValidations();

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
          label="Super DMs"
          name="enabled"
          description="Enable or disable Super DMs."
        >
          <UToggle v-model="state.form.enabled" size="lg" />
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
        <UButton>Save</UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
