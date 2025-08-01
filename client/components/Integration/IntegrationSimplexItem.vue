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
const { t } = useI18n();
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
      title: t("success"),
      description: t("openSimplexAndAccept"),
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
      title: t("success"),
      description: t("simplexIsConnected"),
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
    await axios.post("/integrations/disconnect/simplex");
    toast.add({
      title: t("success"),
      description: t("simplexDisconnected"),
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
  if (isConnected.value) return t("connected");
  if (waitingVerification.value) return t("waitingForVerification");
  return t("notConnected");
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
        <h2 class="text-xl font-medium">{{ $t("simplexIntegration") }}</h2>
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
          {{
            $t("simplexIsConnectedTo", {
              name: config?.config.contact.profile.displayName,
            })
          }}
        </p>
        <div class="flex justify-end">
          <UButton
            @click="disconnect"
            color="red"
            :loading="state.loadingDisconnect"
          >
            {{ $t("disconnect") }}
          </UButton>
        </div>
      </template>

      <template v-else-if="waitingVerification">
        <p class="pb-4">
          {{ $t("acceptRequestInSimplex") }}
        </p>
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
            {{ $t("confirmCode") }}
          </UButton>
          <UButton
            @click="disconnect"
            color="red"
            variant="soft"
            :loading="state.loadingDisconnect"
          >
            {{ $t("disconnect") }}
          </UButton>
        </div>
      </template>

      <template v-else>
        <p class="pb-4">
          {{ $t("enterYourSimplexLink") }}
        </p>
        <UFormGroup
          size="lg"
          :label="t('simplexLink')"
          :error="getValidationAttrs('link').error"
        >
          <UInput
            v-model="state.form.link"
            @blur="getValidationAttrs('link').onBlur"
          />
        </UFormGroup>
        <div class="flex justify-end mt-2 gap-2">
          <UButton :loading="state.loading" @click="connect">
            {{ $t("connect") }}
          </UButton>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="soft" @click="open = false">{{
            $t("cancel")
          }}</UButton>
          <!-- <UButton :loading="state.loading" @click="connect"> Connect </UButton> -->
        </div>
      </template>
    </UCard>
  </UModal>
</template>
