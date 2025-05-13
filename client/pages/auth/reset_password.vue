<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
const { required, maxLength, minLength, sameAs } = useValidations();
const { resetPassword } = useServices();

const { toLogin } = useRouteLocation();

const route = useRoute();
const token = computed(() => route.query.token as string);
const toast = useToast();
const { t } = useI18n();

interface State {
  password?: string;
  confirmPassword?: string;
  loading: boolean;
  errorMessage?: string;
}

useHead({ title: "Login" });

const state: State = reactive({
  password: "",
  confirmPassword: "",
  loading: false,
  errorMessage: undefined,
});

const v = useVuelidate<State>(
  computed(() => ({
    password: { required, maxLength: maxLength(72), minLength: minLength(6) },
    confirmPassword: { sameAs: sameAs(state.password, t("password")) },
  })),
  state
);

const { getValidationAttrs } = useValidations(v);

const handleSubmit = async () => {
  state.errorMessage = undefined;
  const valid = await v.value.$validate();
  if (!valid) return;
  try {
    state.loading = true;
    const res = await resetPassword(
      {
        password: state.password,
      },
      token.value
    );
    toast.add({ title: t("passwordUpdated") });
    return navigateTo(toLogin()?.path);
  } catch (error) {
    state.errorMessage = getErrorMessage(error);
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <AuthContainer
    :title="t('resetPassword')"
    :description="t('enterYourNewPassword')"
  >
    <UForm :state="state" class="form" @submit="handleSubmit">
      <UFormGroup
        :label="t('password')"
        name="password"
        :error="getValidationAttrs('password').error"
      >
        <UInput
          type="password"
          v-model="state.password"
          @blur="getValidationAttrs('password').onBlur"
        />
      </UFormGroup>

      <UFormGroup
        :label="t('confirmPassword')"
        name="confirmPassword"
        :error="getValidationAttrs('confirmPassword').error"
      >
        <UInput
          type="password"
          v-model="state.confirmPassword"
          @blur="getValidationAttrs('confirmPassword').onBlur"
        />
      </UFormGroup>

      <UAlert
        color="red"
        :description="state.errorMessage"
        :title="t('passwordResetFailed')"
        v-if="state.errorMessage"
      >
      </UAlert>

      <UButton block type="submit" :loading="state.loading">
        {{ t("changePassword") }}
      </UButton>
    </UForm>
  </AuthContainer>
</template>

<style scoped lang="scss">
.form {
  @apply gap-4 flex flex-col;
}
</style>
