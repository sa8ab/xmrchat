<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";

interface State {
  email?: string;
  loading: boolean;
  errorMessage?: string;
  isEmailSent: boolean;
}

useHead({ title: "Forgot password" });

const { required, email } = useValidations();
const { forgotPassword } = useServices();

const state: State = reactive({
  email: "",
  isEmailSent: false,
  loading: false,
  errorMessage: undefined,
});

const v = useVuelidate<State>({ email: { required, email } }, state);

const { getValidationAttrs } = useValidations(v);

const clearForm = () => {
  state.isEmailSent = false;
  state.email = "";
};

const handleSubmit = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;
  state.errorMessage = undefined;
  try {
    state.loading = true;
    const res = await forgotPassword({
      email: state.email,
    });
    state.isEmailSent = true;
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <AuthContainer
    title="Reset Password"
    :description="
      state.isEmailSent ? '' : 'Enter your email to reset your password'
    "
  >
    <UForm
      :state="state"
      class="form"
      @submit="handleSubmit"
      v-if="!state.isEmailSent"
    >
      <UFormGroup
        label="Email"
        name="email"
        :error="getValidationAttrs('email').error"
      >
        <UInput
          v-model="state.email"
          @blur="getValidationAttrs('email').onBlur"
        />
      </UFormGroup>

      <UAlert
        color="red"
        :description="state.errorMessage"
        title="Login Failed"
        v-if="state.errorMessage"
      >
      </UAlert>

      <UButton block type="submit" :loading="state.loading"> Submit </UButton>
    </UForm>
    <div v-else>
      <p class="text-base">
        We have sent you an email
        <span class="text-primary font-medium">{{ state.email }}</span
        >, please follow the link in the email to reset your password.
      </p>
      <UButton block class="mt-3" variant="soft" @click="clearForm">
        Change Email
      </UButton>
    </div>
  </AuthContainer>
</template>

<style scoped lang="scss">
.form {
  @apply gap-4 flex flex-col;
}
</style>
