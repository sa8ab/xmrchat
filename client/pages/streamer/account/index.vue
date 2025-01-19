<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";

const { required, minLength, maxLength, sameAs } = useValidations();

const state = reactive({
  oldPassword: "",
  password: "",
  repeatPassword: "",
});

const v = useVuelidate(
  computed(() => ({
    oldPassword: { required },
    password: { required, minLength: minLength(6), maxLength: maxLength(72) },
    repeatPassword: { sameAs: sameAs(state.password, "password") },
  })),
  state
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <PageTitle
      title="Change Password"
      description="Update your login password"
    ></PageTitle>
    <GeneralForm class="w-full max-w-[400px] m-auto">
      <div class="flex flex-col gap-2">
        <UFormGroup
          label="Current password"
          :error="getValidationAttrs('oldPassword').error"
        >
          <PasswordInput
            v-model="state.oldPassword"
            @blur="getValidationAttrs('oldPassword').onBlur"
          />
        </UFormGroup>
        <UFormGroup
          label="New password"
          :error="getValidationAttrs('password').error"
        >
          <PasswordInput
            v-model="state.password"
            @blur="getValidationAttrs('password').onBlur"
          />
        </UFormGroup>

        <UFormGroup
          label="Repeat new password"
          :error="getValidationAttrs('repeatPassword').error"
        >
          <UInput
            v-model="state.repeatPassword"
            @blur="getValidationAttrs('repeatPassword').onBlur"
          />
        </UFormGroup>

        <UButton type="submit" class="mt-2" block>Change password</UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
