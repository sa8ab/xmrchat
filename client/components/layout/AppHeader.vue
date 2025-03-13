<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
const {
  toIndex,
  toContact,
  toLogin,
  toStreamerDisplay,
  toStreamerEdit,
  toStreamer,
  toCreators,
} = useRouteLocation();

const authStore = useAuthStore();
const { logout, state } = authStore;
const route = useRoute();
const { copy } = useCopy();
const { t } = useI18n();

const dropdownItems = computed<DropdownItem[][]>(() => {
  const url = useRequestURL();

  const res: DropdownItem[][] = [
    [
      {
        label: authStore.userEmail || "",
        slot: "account",
        disabled: true,
      },
    ],
    [],
  ];

  if (state.page) {
    res[1].push(
      ...[
        {
          label: "My Tip Page",
          icon: "i-heroicons-banknotes",
          to: toStreamer(state.page.path),
        },
        {
          label: "Edit Tip Page",
          icon: "i-heroicons-pencil-square",
          click: () => navigateTo(toStreamerEdit()?.path),
        },
        {
          label: "Copy OBS Link",
          icon: "i-heroicons-document-duplicate",
          click: () => {
            copy(`${url.origin}/${state.page?.path}/obs`);
          },
          slot: "obs",
        },
      ]
    );
  }

  res[1].push(
    ...[
      {
        label: "My Display Page",
        icon: "i-heroicons-computer-desktop",
        click: () => navigateTo(toStreamerDisplay()?.path),
      },
      {
        label: "Logout",
        icon: "i-heroicons-arrow-left-end-on-rectangle-solid",
        click: () => {
          logout();
        },
      },
    ]
  );

  return res;
});
</script>

<template>
  <nav class="navbar py-2 border-b border-border">
    <div class="inner flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink class="w-[40px]" :to="toIndex()">
          <img src="/images/xmrchat-logo.png" />
          <span class="sr-only">Home Page</span>
        </NuxtLink>
        <ul>
          <li class="flex space-x-1">
            <UButton variant="ghost" color="white" :to="toContact()">
              {{ t("contactUs") }}
            </UButton>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-1">
        <template v-if="!route.meta.hideHeaderLogin">
          <!-- <UDropdown
            v-if="authStore.isLoggedIn"
            :items="dropdownItems"
            :ui="{
              width: 'w-auto',
              item: {
                disabled: 'cursor-text select-text',
              },
            }"
          >
            <template #account="{ item }">
              <div>
                {{ item.label }}
              </div>
            </template>
            <template #obs="{ item }">
              <UIcon
                :name="item.icon"
                class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500"
              />
              <div>{{ item.label }}</div>
              <UBadge size="xs" variant="subtle">Beta</UBadge>
            </template>
            <UButton
              color="primary"
              label="Account"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown> -->
          <UButton
            v-if="authStore.isLoggedIn"
            icon="i-heroicons-user"
            :to="toStreamerDisplay()"
          >
            {{ t("account") }}
          </UButton>
          <UButton v-else :to="toLogin()">{{ t("creatorLogin") }}</UButton>
        </template>

        <LanguageSelect />

        <UButton
          square
          icon="i-heroicons-magnifying-glass"
          color="gray"
          :to="toCreators()"
        >
          <span class="sr-only">{{ t("searchCreators.title") }}</span>
        </UButton>
        <ColorMode />
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss"></style>
