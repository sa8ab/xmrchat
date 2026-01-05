<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import { ContentLinkPlatformEnum } from "~/types/enums";

const emit = defineEmits<{
  verified: [];
}>();

const authStore = useAuthStore();
const requestUrl = useRequestURL();
const { axios } = useApp();
const { required, url } = useValidations();
const toast = useToast();

const state = reactive({
  url: "",
  pending: false,
});

const verificationUrl = computed(() => {
  const page = authStore.state.page;
  if (!page) return "-";
  return `${requestUrl.origin}/${page.path}`;
});

const handleVerify = async () => {
  const valid = await v.value.$validate();
  if (!valid) return;

  state.pending = true;

  try {
    await axios.post(`/link-verifications/${ContentLinkPlatformEnum.X}`, {
      url: state.url.trim(),
    });
    toast.add({
      color: "green",
      title: "Verification successful!",
    });

    emit("verified");
  } catch (error) {
    toast.add({
      color: "red",
      title: getErrorMessage(error),
    });
  } finally {
    state.pending = false;
  }
};

const v = useVuelidate(
  {
    url: { required, url },
  },
  computed(() => state)
);

const { getValidationAttrs } = useValidations(v);
</script>

<template>
  <div>
    <p>To auto-verify your Twitter account:</p>

    <p class="pt-4">
      1. Post a tweet containing your XMRChat link:
      {{ verificationUrl }} (max 280 characters). Make sure to use this specific
      verification link.
    </p>
    <p class="pt-2">
      2. Then paste the full URL of the tweet in this form, for example:
      https://x.com/username/status/12341234 and click on Verify Tweet.
    </p>
  </div>

  <div class="pt-6">
    <GeneralForm @submit="handleVerify">
      <UFormGroup
        label="Tweet URL"
        name="url"
        :error="getValidationAttrs('url').error"
      >
        <UInput
          v-model="state.url"
          placeholder="https://x.com/username/status/12341234"
          type="url"
          @blur="getValidationAttrs('url').onBlur"
        />
      </UFormGroup>

      <div class="flex mt-4">
        <UButton type="submit" :loading="state.pending"> Verify Tweet </UButton>
      </div>
    </GeneralForm>
  </div>
</template>

<style scoped></style>
