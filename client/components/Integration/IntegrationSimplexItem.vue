<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { IntegrationConfigType } from "~/types/enums";

const { required } = useValidations();
const { axios } = useApp();
const toast = useToast();

const open = ref(false);

const state = reactive({
  form: {
    link: "",
  },
  loading: false,
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

const v = useVuelidate<any>(
  { link: { required } },
  computed(() => state.form)
);
const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <IntegrationItem
    :integrationType="IntegrationConfigType.SIMPLEX"
    @connect="open = true"
  />
  <UModal v-model="open">
    <UCard>
      <template #header>
        <h2 class="text-xl font-medium">Simplex Integration</h2>
      </template>
      <p class="pb-4">
        Enter your simplex connection link then click connect. XMRChat account
        will send you a connection request to your simplex account. Accept the
        request to connect.
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

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="soft" @click="open = false">Cancel</UButton>
          <UButton :loading="state.loading" @click="connect"> Connect </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
