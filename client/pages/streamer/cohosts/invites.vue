<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { CohostInvitation } from "~/types";

const { email, required } = useValidations();
const { axios } = useApp();
const toast = useToast();
const { relativeDate, dayjs } = useDate();

const state = reactive({
  email: "",
  loading: false,
});

const { data, error, pending } = useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ cohostInvitations: CohostInvitation[] }>(
      `/cohost-invitations/pending`
    );
    return data.cohostInvitations;
  },
  { server: false }
);

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
      <h2 class="text-lg font-medium">Pending invitations</h2>
      <!-- <div>
        <NoItems />
      </div> -->
      <div class="grid gap-2">
        <CohostInvitation v-for="invitation in data" :invitation="invitation" />
      </div>
    </div>
  </div>
</template>
