<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { PageVerification } from "~/types";
import { PageVerificationTypeEnum } from "~/types/enums";

const { axios } = useApp();
const toast = useToast();
const { t } = useI18n();
const authStore = useAuthStore();
const requestUrl = useRequestURL();
const { url, required } = useValidations();

const state = reactive({
  url: "",
  pending: false,
});

const { data, pending, refresh, error } = await useLazyAsyncData(
  "streamer-verification",
  async () => {
    const { data } = await axios.get<{ pageVerifications: PageVerification[] }>(
      `/page-verification`
    );
    return data.pageVerifications;
  },
  { server: false }
);

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
    await axios.post("/page-verification", {
      type: PageVerificationTypeEnum.X,
      url: state.url.trim(),
    });
    toast.add({
      color: "green",
      title: "Verification successful!",
    });
    state.url = "";
    refresh();
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
    <PageTitle
      title="Verification"
      description="Link your social media accounts to verify your profile"
    />

    <div v-if="pending && !data"></div>

    <ErrorView :error="error" v-else-if="error" />

    <div v-else>
      <div v-if="data?.length">
        <h3>Verifications</h3>
        <div v-for="item in data">
          <div class="font-medium">{{ item.type }}:</div>
          <div>
            <ULink v-if="item.verifiedUrl" :to="item.verifiedUrl" external>
              {{ item.name }}
            </ULink>
            <ULink :to="item.url" external> Verification </ULink>
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <p>To auto-verify your Twitter account:</p>

          <p class="pt-4">
            1. Post a tweet containing your XMRChat link:
            {{ verificationUrl }} (max 280 characters). Make sure to use this
            specific verification link, not your regular profile link or a
            listing.
          </p>
          <p class="pt-2">
            2. Then paste the full URL of the tweet in this form, for example:
            https://x.com/MyUsername/status/123123123123123123 and click on
            Verify Tweet.
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
                placeholder="https://x.com/username/status/1234567890"
                type="url"
                @blur="getValidationAttrs('url').onBlur"
              />
            </UFormGroup>

            <div class="flex mt-4">
              <UButton type="submit" :loading="state.pending">
                Verify Tweet
              </UButton>
            </div>
          </GeneralForm>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
