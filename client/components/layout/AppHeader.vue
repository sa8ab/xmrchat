<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
const {
  toIndex,
  toContact,
  toLogin,
  toStreamerDisplay,
  toStreamerEdit,
  toStreamer,
} = useRouteLocation();

const authStore = useAuthStore();
const { logout, state } = authStore;
const route = useRoute();

const dropdownItems = computed<DropdownItem[][]>(() => {
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
              Contact Us
            </UButton>
          </li>
        </ul>
      </div>
      <div class="flex space-x-3 items-center">
        <template v-if="!route.meta.hideHeaderLogin">
          <UDropdown
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
            <UButton
              color="primary"
              label="Account"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
          <UButton v-else :to="toLogin()">Streamer Login</UButton>
        </template>

        <ColorMode />
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss"></style>
