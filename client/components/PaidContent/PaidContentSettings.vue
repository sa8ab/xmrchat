<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import type { Numberic, PageSetting } from "~/types";
import { PageSettingKey } from "~/types/enums";

interface State {
  form: {};
  telegramUrl?: string;
  loadingUrl: boolean;
}

const { required, numberic } = useValidations();
const { axios } = useApp();
const toast = useToast();

const state = reactive<State>({
  form: {},
  telegramUrl: undefined,
  loadingUrl: false,
});

const { data, pending } = await useLazyAsyncData(
  async () => {
    const { data } = await axios.get<{ settings: PageSetting[] }>(
      `/paid-content/settings`,
    );
    const telegramUserId = data.settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_USER_ID,
    )?.value;
    const telegramPaidContentId = data.settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_PAID_CONTENT_ID,
    )?.value;

    return { telegramUserId, telegramPaidContentId };
  },
  { server: false },
);

const createTelegramUrl = async () => {
  try {
    state.loadingUrl = true;
    const { data } = await axios.post<{ url: string }>(
      `/paid-content/telegram-url`,
    );
    state.telegramUrl = data.url;
  } catch (error) {
    toast.add({ description: getErrorMessage(error) });
  } finally {
    state.loadingUrl = false;
  }
};

const v = useVuelidate<State["form"]>(
  computed(() => ({
    minSuperDmAmount: { required, numberic },
  })),
  computed(() => state.form),
);

const { getValidationAttrs } = useValidations(v);

const showCreateUrl = computed(() => !state.telegramUrl);
</script>

<template>
  <div>
    <div v-if="pending">Pending...</div>
    <div v-else>
      <template v-if="showCreateUrl">
        <p>
          Click the button bellow to create the link for your telegram. The link
          will start Telegram directly.
        </p>
        <div>
          <UButton :loading="state.loadingUrl" @click="createTelegramUrl">
            Create Link
          </UButton>
        </div>
      </template>
      <template v-else>
        <div>
          <p class="text-lg font-medium">Start Telegram</p>
          <p class="pt-2">Click the button to start Telegram.</p>
          <UButton
            :to="state.telegramUrl"
            external
            target="_blank"
            class="mt-2"
            trailingIcon="i-heroicons-arrow-top-right-on-square"
          >
            Open Telegram
          </UButton>
        </div>

        <UDivider class="my-4" />
        <div>
          <p class="text-lg font-medium">Add to your group</p>
          <p class="pt-2">
            Add it to the group as an admin using the user that you already
            started telegram in the previous step.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
