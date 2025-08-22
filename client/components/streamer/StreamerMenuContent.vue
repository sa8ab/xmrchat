<script lang="ts" setup>
const authStore = useAuthStore();
const { state, logout } = authStore;
const { isAdmin, isPremium } = storeToRefs(authStore);
const { t } = useI18n();

const page = computed(() => state.page);
const {
  toStreamer,
  toStreamerDisplay,
  toStreamerAccount,
  toStreamerEdit,
  toStreamerOBS,
  toStreamerContentLinks,
  toUsers,
  toPages,
  toStreamerNotificationPreferences,
  toStreamerIntegrations,
  toStreamerRecipients,
} = useRouteLocation();

const items = computed(() => {
  const res: Record<string, any>[] = [];

  if (isAdmin.value) {
    res.push(
      ...[
        { label: "Users", icon: "i-heroicons-users", to: toUsers() },
        {
          label: "Pages",
          icon: "i-heroicons-square-3-stack-3d",
          to: toPages(),
        },
        {
          divider: true,
        },
      ]
    );
  }

  res.push(
    ...[
      {
        label: t("myXmrchats"),
        icon: "i-heroicons-computer-desktop",
        to: toStreamerDisplay(),
        exact: true,
      },
      {
        label: t("account"),
        icon: "i-heroicons-user",
        to: toStreamerAccount(),
      },
    ]
  );

  if (page.value) {
    res.push(
      ...[
        {
          label: t("editTipPage"),
          icon: "i-heroicons-pencil-square",
          to: toStreamerEdit(),
        },
        {
          label: t("tipPage"),
          icon: "i-heroicons-banknotes",
          to: toStreamer(page.value.path),
        },
      ]
    );

    if (isPremium.value || isAdmin.value) {
      res.push(
        ...[
          {
            label: "Notifications",
            icon: "i-heroicons-bell",
            to: toStreamerNotificationPreferences(),
          },
          {
            label: "Integrations",
            icon: "i-tabler-plug",
            to: toStreamerIntegrations(),
          },
          {
            label: "Recipients",
            icon: "i-heroicons-users",
            to: toStreamerRecipients(),
          },
        ]
      );
    }

    res.push(
      ...[
        {
          label: t("contentLinks"),
          icon: "i-heroicons-link-20-solid",
          to: toStreamerContentLinks(),
        },
        {
          label: t("obs"),
          icon: "i-heroicons-video-camera",
          to: toStreamerOBS(),
        },
      ]
    );
  }

  return res;
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col items-center gap-2">
      <GeneralImage
        v-if="page"
        :url="page?.logo.url"
        variant="logo"
        class="w-[80px] h-[80px]"
      />
      <span class="font-medium text-lg">{{ page?.path || "-" }}</span>
      <span class="text-pale text-sm">{{ state.user?.email }}</span>
    </div>
    <div class="flex flex-col gap-1 mt-6">
      <template v-for="item in items">
        <UDivider v-if="item.divider" class="my-2" />
        <ULink
          v-else
          :to="item.to"
          :exact="item.exact"
          variant="soft"
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-primary transition-all"
          activeClass="bg-primary text-white dark:text-gray-900 pointer-events-none"
        >
          <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
          <span>
            {{ item.label }}
          </span>
        </ULink>
      </template>

      <UDivider class="my-2" />
      <UButton color="red" variant="ghost" @click="logout">
        <UIcon
          name="i-heroicons-arrow-left-end-on-rectangle-solid"
          class="w-5 h-5"
        />
        <span>{{ t("logout") }}</span>
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
