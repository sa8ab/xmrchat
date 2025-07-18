<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { IntegrationConfig } from "~/types";
import { IntegrationConfigType } from "~/types/enums";

const props = defineProps<{
  config?: IntegrationConfig;
}>();

const emit = defineEmits<{
  connect: [];
  disconnect: [];
}>();

const { required } = useValidations();
const { axios } = useApp();
const toast = useToast();

const open = ref(false);

const state = reactive({
  form: {
    link: "",
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
    const { data } = await axios.post("/integrations/connect/simplex", {
      address: state.form.link,
    });

    toast.add({
      title: "Success",
      description:
        "Open SimpleX app on your device and accept connection from XMRChat account.",
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

const confirmCode = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;
  try {
    state.loading = true;
    const { data } = await axios.post("/integrations/confirm/simplex", {
      code: state.form.code,
    });

    open.value = false;

    toast.add({
      title: "Success",
      description: "Simplex is connected.",
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
    await axios.post("/integrations/disconnect/simplex");
    toast.add({
      title: "Success",
      description: "Simplex disconnected.",
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
    state.loadingDisconnect = false;
  }
};

const isConnected = computed(() => {
  return props.config?.config?.contact && props.config.verified;
});

const waitingVerification = computed(() => {
  if (props.config?.verified) return false;
  return props.config?.config;
});

const renderInfo = computed(() => {
  if (isConnected.value) return "Connected";
  if (waitingVerification.value) return "Waiting for verification";
  return "Not connected.";
});

const v = useVuelidate<any>(
  computed(() => {
    return waitingVerification.value
      ? { link: {}, code: { required } }
      : { link: { required }, code: {} };
  }),
  computed(() => state.form)
);
const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <IntegrationItem
    :integrationType="IntegrationConfigType.SIMPLEX"
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
        <h2 class="text-xl font-medium">Simplex Integration</h2>
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
          Simplex is connected to account "{{
            config?.config.contact.profile.displayName
          }}".
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
        <p class="pb-4">
          Accept connection request in SimpleX app and enter the code you get.
        </p>
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
          Enter your simplex connection link then click connect. XMRChat account
          will send a connection request to your simplex account. After
          accepting the request you will get a code. Enter the code to complete
          the connection.
        </p>
        <UFormGroup
          size="lg"
          label="SimpleX link"
          :error="getValidationAttrs('link').error"
        >
          <UInput
            v-model="state.form.link"
            @blur="getValidationAttrs('link').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2 gap-2">
          <UButton :loading="state.loading" @click="connect"> Connect </UButton>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="soft" @click="open = false">Cancel</UButton>
          <!-- <UButton :loading="state.loading" @click="connect"> Connect </UButton> -->
        </div>
      </template>
    </UCard>
  </UModal>
</template>
