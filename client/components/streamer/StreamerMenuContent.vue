<script lang="ts" setup>
const { state } = useAuthStore();

const page = computed(() => state.page);
const { toStreamer, toStreamerDisplay, toStreamerEdit } = useRouteLocation();

const items = computed(() => {
  const res: Record<string, any>[] = [];

  res.push(
    ...[
      {
        label: "My Display Page",
        icon: "i-heroicons-computer-desktop",
        to: toStreamerDisplay(),
        exact: true,
      },
    ]
  );

  if (page.value) {
    res.push(
      ...[
        {
          label: "Edit Page",
          icon: "i-heroicons-pencil-square",
          to: toStreamerEdit(),
        },
        {
          label: "My Tip Page",
          icon: "i-heroicons-banknotes",
          to: toStreamer(page.value.path),
        },
        {
          label: "Settings",
          icon: "i-heroicons-cog-6-tooth",
          to: "/",
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
      <GeneralImage :url="page?.logo.url" variant="logo" class="w-[80px]" />
      <span class="font-medium text-lg">{{ page?.path || "-" }}</span>
      <span class="text-pale text-sm">{{ state.user?.email }}</span>
    </div>
    <div class="flex flex-col gap-1 mt-6">
      <ULink
        v-for="item in items"
        :to="item.to"
        :exact="item.exact"
        variant="soft"
        class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:text-primary transition-all"
        activeClass="bg-primary text-gray-900 pointer-events-none"
      >
        <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
        <span>
          {{ item.label }}
        </span>
      </ULink>
      <UDivider class="my-2" />
      <UButton color="red" variant="ghost">
        <UIcon
          name="i-heroicons-arrow-left-end-on-rectangle-solid"
          class="w-5 h-5"
        />
        <span>Logout</span>
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
