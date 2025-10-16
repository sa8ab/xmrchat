<script setup lang="ts">
import useVuelidate from "@vuelidate/core";

const { email, required } = useValidations();
const { axios } = useApp();
const toast = useToast();

const state = reactive({
  email: "",
  loading: false,
});

const sendInvitation = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  state.loading = true;
  try {
    const {} = await axios.post(`/cohost-invitations`, {
      email: state.email,
    });
    toast.add({
      title: "Invitation sent",
      description: "The invitation has been sent to the user.",
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: getErrorMessage(error),
      color: "red",
    });
  } finally {
    state.loading = false;
  }
};

const v = useVuelidate(
  {
    email: { required, email },
  },
  state
);
const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <PageTitle
      title="Cohosts Invitations"
      description="Invite cohosts to your page."
    />
    <div class="grid gap-2">
      <h2 class="text-lg font-medium">Invite Cohosts</h2>

      <GeneralForm>
        <div class="grid gap-2">
          <UFormGroup
            size="lg"
            label="Email"
            class="flex-1 max-w-[400px]"
            :error="getValidationAttrs('email').error"
          >
            <UInput
              v-model="state.email"
              @blur="getValidationAttrs('email').onBlur"
            />
          </UFormGroup>
          <div>
            <UButton size="lg" :loading="state.loading" @click="sendInvitation">
              Send Invitation
            </UButton>
          </div>
        </div>
      </GeneralForm>
      <UDivider class="my-6" />
    </div>
    <div class="grid gap-2">
      <h2 class="text-lg font-medium">Invitations</h2>
      <!-- <div>
        <NoItems />
      </div> -->
      <div class="grid gap-2">
        <div
          class="rounded-lg ring-1 ring-border px-6 py-4 flex gap-3 items-center"
        >
          <div
            class="p-2 rounded-full ring-1 ring-border flex items-center justify-center"
          >
            <UIcon name="i-heroicons-user" size="20" />
          </div>
          <div class="flex-1">
            <p class="font-medium">email</p>
            <p class="text-pale text-sm">expires at</p>
          </div>
          <div>
            <!-- actions -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
