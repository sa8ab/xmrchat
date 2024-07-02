<script setup lang="ts">
const { toIndex, toContact, toLogin, toStreamerDisplay } = useRouteLocation();

const authStore = useAuthStore();
const { logout } = authStore;
const route = useRoute();

const dropdownItems = computed(() => {
  return [
    [
      {
        label: authStore.userEmail || "",
        slot: "account",
        disabled: true,
      },
    ],
    [
      {
        label: "My Page",
        icon: "i-heroicons-user-circle",
        to: toStreamerDisplay(),
      },
      {
        label: "Logout",
        icon: "i-heroicons-arrow-left-end-on-rectangle-solid",
        click: () => {
          logout();
        },
      },
    ],
  ];
});
</script>

<template>
  <nav class="navbar py-2 border-b border-border">
    <div class="inner flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink class="w-[40px]" :to="toIndex()">
          <img src="/images/xmrchat-logo.png" />
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
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
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
