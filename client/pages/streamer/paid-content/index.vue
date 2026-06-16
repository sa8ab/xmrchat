<script setup lang="ts">
import { ConfirmModal } from "#components";
import type { PageSetting, PaidContent } from "~/types";
import { PageSettingKey } from "~/types/enums";

const {
  toStreamerPaidContentCreate,
  toStreamerPaidContentEdit,
  toStreamerPaidContentSettings,
} = useRouteLocation();
const { t } = useI18n();
const { axios } = useApp();
const modal = useModal();
const toast = useToast();
const config = useRuntimeConfig();

const authStore = useAuthStore();

const { copy } = useCopy();

const { data, pending, error, refresh } = useLazyAsyncData(
  async () => {
    const { data: paidContentData } = await axios.get<{
      paidContent: PaidContent[];
    }>(`/paid-content`);

    const { data } = await axios.get<{ settings: PageSetting[] }>(
      `/paid-content/settings`,
    );
    const telegramUserId = data.settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_USER_ID,
    )?.value;
    const telegramPaidContentId = data.settings.find(
      (s) => s.key === PageSettingKey.TELEGRAM_PAID_CONTENT_ID,
    )?.value;

    return {
      paidContent: paidContentData.paidContent,
      settings: { telegramUserId, telegramPaidContentId },
    };
  },
  {
    server: false,
  },
);

const startUrl = computed(() => {
  return `https://t.me/${config.public.telegramPaidContentUsername}?start=${authStore.state.page?.path}`;
});

const columns = computed(() => [
  {
    key: "name",
    label: t("name"),
  },
  {
    key: "duration",
    label: "Duration",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "actions",
  },
]);

const handleDeleteClick = async (id: number) => {
  modal.open(ConfirmModal, {
    color: "red",
    text: "Are you sure you want to delete this paid content?",
    title: "Delete Paid Content",
    onConfirm: () => handleDelete(id),
  });
};

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`/paid-content/${id}`);
    await refresh();
  } catch (error) {
    toast.add({
      description: getErrorMessage(error),
      color: "red",
    });
  }
};

const showNotConfigured = computed(() => {
  return (
    (!data?.value?.settings.telegramUserId ||
      !data?.value?.settings.telegramPaidContentId) &&
    (!pending.value || data.value)
  );
});
</script>

<template>
  <div>
    <PageTitle title="Paid Content" description="Manage your paid content" />

    <PaidContentNotConfigured v-if="showNotConfigured" class="mb-6" />

    <div class="flex justify-end mb-4 gap-2 flex-wrap">
      <UButton
        variant="soft"
        @click="copy(startUrl)"
        leadingIcon="i-heroicons-clipboard"
      >
        Copy start url
      </UButton>
      <UButton :to="toStreamerPaidContentSettings()" variant="soft">
        Settings
      </UButton>
      <UButton :to="toStreamerPaidContentCreate()">Create Paid Content</UButton>
    </div>

    <UTable
      :rows="data?.paidContent || []"
      :columns="columns"
      class="border border-border rounded-md"
      :ui="{
        td: { base: 'whitespace-normal text-text dark:text-text' },
      }"
    >
      <template #amount-data="{ row }">
        <span>{{ row.amount ? `${row.amount} XMR` : "-" }}</span>
      </template>
      <template #actions-data="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton
            variant="ghost"
            color="primary"
            :to="toStreamerPaidContentEdit(row.id)"
          >
            {{ $t("edit") }}
          </UButton>
          <UButton
            variant="ghost"
            color="red"
            @click="handleDeleteClick(row.id)"
          >
            {{ $t("delete") }}
          </UButton>
        </div>
      </template>
      <template #empty-state>
        <NoItems />
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
