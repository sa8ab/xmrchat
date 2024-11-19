<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";

useHead({
  title: "Sign up",
});

const { required, email, sameAs, validate } = useValidations();
const { signup } = useAuthStore();
const { toLogin } = useRouteLocation();
const toast = useToast();

const state = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  passwordVisible: false,
  loading: false,
  errorMessage: undefined,
});

const v = useVuelidate(
  computed(() => ({
    email: { required, email },
    password: { required },
    confirmPassword: { sameAs: sameAs(state.password, "password") },
  })),
  state
);

const handleSubmit = async () => {
  state.errorMessage = undefined;
  try {
    state.loading = true;
    await signup({
      email: state.email,
      password: state.password,
    });
    toast.add({
      title: "Signup Successfull",
      description:
        "Please follow the link sent to your email to verify your account.",
      timeout: 8000,
    });
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <AuthContainer title="Signup">
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
        <div class="flex gap-2">
          <UInput
            class="flex-grow"
            :type="state.passwordVisible ? 'text' : 'password'"
            v-model="state.password"
          />

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

      <UFormGroup label="Confirm Password" name="confirmPassword">
        <UInput type="password" v-model="state.confirmPassword" />
      </UFormGroup>

      <UAlert
        color="red"
        :description="state.errorMessage"
        title="Signup Failed"
        v-if="state.errorMessage"
      >
      </UAlert>

      <UButton block type="submit" :loading="state.loading">Sign up</UButton>

      <UButton :to="toLogin()" block type="button" variant="outline">
        Login Instead
      </UButton>
    </UForm>
  </AuthContainer>
</template>

<style scoped lang="scss">
.form {
  @apply gap-4 flex flex-col;
}
</style>
