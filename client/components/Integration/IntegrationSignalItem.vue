<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { IntegrationConfig } from "~/types";
import { IntegrationConfigType } from "~/types/enums";

const props = defineProps<{
  config?: IntegrationConfig;
}>();

const emit = defineEmits<{
  connect: [];
}>();

const { required } = useValidations();
const { axios } = useApp();
const toast = useToast();

const open = ref(false);

const state = reactive({
  form: {
    number: "",
    code: "",
  },
  loading: false,
  loadingDisconnect: false,
});

const connect = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;
  try {
    state.loading = true;
    const { data } = await axios.post("/integrations/connect/signal", {
      number: state.form.number,
    });

    // toast.add({
    //   title: "Success",
    //   description:
    //     "Enter the code you received in your Signal app to verify your account.",
    //   color: "green",
    // });
    // open.value = false;
    emit("connect");
  } catch (error) {
    console.log(error);

    toast.add({
      title: "Error",
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loading = false;
  }
};

const confirmCode = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;
  try {
    state.loading = true;
    const { data } = await axios.post("/integrations/confirm/signal", {
      code: state.form.code,
    });

    open.value = false;

    toast.add({
      title: "Success",
      description: "Signal is connected.",
      color: "green",
    });
    emit("connect");
  } catch (error) {
    console.log(error);

    toast.add({
      title: "Error",
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loading = false;
  }
};

const disconnect = async () => {
  try {
    state.loadingDisconnect = true;
    await axios.post("/integrations/disconnect/signal");
    toast.add({
      title: "Success",
      description: "Signal is disconnected.",
      color: "green",
    });
    open.value = false;
    emit("connect");
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loadingDisconnect = false;
  }
};

const waitingVerification = computed(() => {
  return props.config?.config && !props.config.verified;
});

const isConnected = computed(() => {
  return props.config?.verified;
});

const renderInfo = computed(() => {
  if (isConnected.value) return `Connected.`;
  if (waitingVerification.value) return `Waiting for verification.`;
  return "Not connected.";
});

const v = useVuelidate<any>(
  computed(() => {
    return waitingVerification.value
      ? { number: {}, code: { required } }
      : { number: { required }, code: {} };
  }),
  computed(() => state.form)
);
const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <IntegrationItem
    :integrationType="IntegrationConfigType.SINGAL"
    @connect="open = true"
  >
    <template #info>
      <div class="text-sm text-pale">
        <p>{{ renderInfo }}</p>
      </div>
    </template>
  </IntegrationItem>
  <UModal v-model="open">
    <UCard>
      <template #header>
        <h2 class="text-xl font-medium">Signal Integration</h2>
      </template>

      <template v-if="isConnected">
        <div class="flex justify-center pb-4">
          <UIcon
            name="i-heroicons-check-16-solid"
            class="text-primary"
            size="60px"
          />
        </div>
        <p class="pb-4 text-center">
          Signal is connected to account {{ config?.config.number }}.
        </p>
        <div class="flex justify-end">
          <UButton
            @click="disconnect"
            color="red"
            :loading="state.loadingDisconnect"
          >
            Disconnect
          </UButton>
        </div>
      </template>

      <template v-else-if="waitingVerification">
        <p class="pb-4">Enter the code sent to your signal app.</p>
        <UFormGroup
          size="lg"
          label="Code"
          :error="getValidationAttrs('code').error"
        >
          <UInput
            v-model="state.form.code"
            @blur="getValidationAttrs('code').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2 gap-2">
          <UButton :loading="state.loading" @click="confirmCode">
            Confirm code
          </UButton>
          <UButton
            @click="disconnect"
            color="red"
            variant="soft"
            :loading="state.loadingDisconnect"
          >
            Disconnect
          </UButton>
        </div>
      </template>

      <template v-else>
        <p class="pb-4">
          Enter your signal phone number or id. We will send a code to this
          number to verify.
        </p>
        <UFormGroup
          size="lg"
          label="Signal phone number or id"
          :error="getValidationAttrs('number').error"
        >
          <UInput
            v-model="state.form.number"
            @blur="getValidationAttrs('number').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2">
          <UButton :loading="state.loading" @click="connect">
            Send code
          </UButton>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="soft" @click="open = false">Cancel</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
