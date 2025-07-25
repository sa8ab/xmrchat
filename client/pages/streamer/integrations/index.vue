<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { IntegrationConfig } from "~/types";
import { IntegrationConfigType } from "~/types/enums";

const { axios } = useApp();
const toast = useToast();
const { numberic } = useValidations();
const authStore = useAuthStore();

interface State {
  // form: Form;
  pending: boolean;
}

const state = reactive<State>({
  pending: false,
});

const {
  data: integrations,
  error,
  refresh,
} = await useLazyAsyncData(
  async () => {
    const res = await axios.get<{ integrations: IntegrationConfig[] }>(
      "/integrations"
    );
    return res.data;
  },
  { server: false }
);

const simplexConfig = computed(() => {
  return integrations.value?.integrations.find(
    (i) => i.type === IntegrationConfigType.SIMPLEX
  );
});

const signalConfig = computed(() => {
  return integrations.value?.integrations.find(
    (i) => i.type === IntegrationConfigType.SIGNAL
  );
});
const v = useVuelidate<any>({}, state);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <PageTitle title="Integrations" description="Manage your integrations" />

    <ErrorView :error="error" v-if="error" />
    <div
      v-else
      class="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4"
    >
      <IntegrationSimplexItem :config="simplexConfig" @connect="refresh" />
      <IntegrationSignalItem :config="signalConfig" @connect="refresh" />
    </div>
  </div>
</template>

<style scoped></style>
