<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
const { required, email, validate } = useValidations();
const { login } = useAuthStore();
const { toSignup, toForgotPassword } = useRouteLocation();

interface State {
  email?: string;
  password?: string;
  loading: boolean;
  errorMessage?: string;
  passwordVisible: boolean;
}

useHead({ title: "Login" });

const state: State = reactive({
  email: "",
  password: "",
  passwordVisible: false,
  loading: false,
  errorMessage: undefined,
});

const v = useVuelidate<State>(
  { email: { required, email }, password: { required } },
  state
);

const handleSubmit = async () => {
  state.errorMessage = undefined;
  try {
    state.loading = true;
    const res = await login({
      email: state.email,
      password: state.password,
    });
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <AuthContainer
    title="Login"
    description="Login to your account in order to access your display page."
  >
    <UForm
      :state="state"
      :validate="() => validate(v)"
      class="form"
      @submit="handleSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <div class="flex gap-1">
          <UInput
            class="flex-grow"
            :type="state.passwordVisible ? 'text' : 'password'"
            v-model="state.password"
          >
          </UInput>
          <UButton
            v-if="state.passwordVisible"
            @click="state.passwordVisible = false"
            icon="i-heroicons-eye-slash"
            square
            color="gray"
          ></UButton>
          <UButton
            v-else
            @click="state.passwordVisible = true"
            icon="i-heroicons-eye"
            square
            color="gray"
          ></UButton>
        </div>
      </UFormGroup>

      <UAlert
        color="red"
        :description="state.errorMessage"
        title="Login Failed"
        v-if="state.errorMessage"
      >
      </UAlert>

      <UButton block type="submit" :loading="state.loading"> Login </UButton>
      <UButton variant="outline" block type="button" :to="toSignup()">
        Signup Instead
      </UButton>
      <UButton :to="toForgotPassword()" variant="link" :padded="false">
        Forgot password ?
      </UButton>
    </UForm>
  </AuthContainer>
</template>

<style scoped lang="scss">
.form {
  @apply gap-4 flex flex-col;
}
</style>
