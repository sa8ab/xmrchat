<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";

useHead({
  title: "Sign up",
});

const { required, email, maxLength, minLength, sameAs, validate } =
  useValidations();
const { signup } = useAuthStore();
const { toLogin } = useRouteLocation();
const toast = useToast();
const { t } = useI18n();

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
    password: { required, maxLength: maxLength(72), minLength: minLength(6) },
    confirmPassword: { sameAs: sameAs(state.password, t("password")) },
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
      title: t("signupSuccessfull"),
      description: t("signupSuccessfullDescription"),
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
  <AuthContainer :title="t('signup')">
    <UForm
      :state="state"
      :validate="() => validate(v)"
      class="form"
      @submit="handleSubmit"
    >
      <UFormGroup :label="t('email')" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup :label="t('password')" name="password">
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

      <UFormGroup :label="t('confirmPassword')" name="confirmPassword">
        <UInput type="password" v-model="state.confirmPassword" />
      </UFormGroup>

      <UAlert
        color="red"
        :description="state.errorMessage"
        :title="t('signupFailed')"
        v-if="state.errorMessage"
      >
      </UAlert>

      <UButton block type="submit" :loading="state.loading">{{
        t("signup")
      }}</UButton>

      <UButton :to="toLogin()" block type="button" variant="outline">
        {{ t("loginInstead") }}
      </UButton>
    </UForm>
  </AuthContainer>
</template>

<style scoped lang="scss">
.form {
  @apply gap-4 flex flex-col;
}
</style>
