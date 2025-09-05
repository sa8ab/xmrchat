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
const { t } = useI18n();

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

    emit("connect");
  } catch (error) {
    console.log(error);

    toast.add({
      title: t("error"),
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
      title: t("success"),
      description: t("signalIsConnected"),
      color: "green",
    });
    emit("connect");
  } catch (error) {
    console.log(error);

    toast.add({
      title: t("error"),
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
      title: t("success"),
      description: t("signalIsDisconnected"),
      color: "green",
    });
    open.value = false;
    emit("connect");
  } catch (error) {
    console.log(error);
    toast.add({
      title: t("error"),
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
  if (isConnected.value) return t("connected");
  if (waitingVerification.value) return t("waitingForVerification");
  return t("notConnected");
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
    :integrationType="IntegrationConfigType.SIGNAL"
    @connect="open = true"
    :connected="isConnected"
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
        <h2 class="text-xl font-medium">{{ $t("signalIntegration") }}</h2>
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
          {{ $t("signalIsConnectedTo", { number: config?.config.number }) }}
        </p>
        <div class="flex justify-end">
          <UButton
            @click="disconnect"
            color="red"
            :loading="state.loadingDisconnect"
          >
            {{ t("disconnect") }}
          </UButton>
        </div>
      </template>

      <template v-else-if="waitingVerification">
        <p class="pb-4">{{ t("enterCodeinSignalApp") }}</p>
        <UFormGroup
          size="lg"
          :label="t('code')"
          :error="getValidationAttrs('code').error"
        >
          <UInput
            v-model="state.form.code"
            @blur="getValidationAttrs('code').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2 gap-2">
          <UButton :loading="state.loading" @click="confirmCode">
            {{ t("confirmCode") }}
          </UButton>
          <UButton
            @click="disconnect"
            color="red"
            variant="soft"
            :loading="state.loadingDisconnect"
          >
            {{ t("disconnect") }}
          </UButton>
        </div>
      </template>

      <template v-else>
        <p class="pb-4">
          {{ t("enterSignalNumOrId") }}
        </p>
        <UFormGroup
          size="lg"
          :label="t('signalPhoneNumOrId')"
          :error="getValidationAttrs('number').error"
        >
          <UInput
            v-model="state.form.number"
            placeholder="+15551234567 or MyUsername123"
            @blur="getValidationAttrs('number').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2">
          <UButton :loading="state.loading" @click="connect">
            {{ $t("sendCode") }}
          </UButton>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="soft" @click="open = false">{{
            $t("cancel")
          }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
