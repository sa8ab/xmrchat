<script lang="ts" setup>
import type { PageLink } from "~/types";

const props = defineProps<{
  links?: PageLink[];
}>();

const linksComputed = computed(() =>
  props.links
    ?.filter((l) => !!l.value)
    .map((l) => {
      return {
        ...PAGE_LINKS[l.platform as keyof typeof PAGE_LINKS],
        value: l.value,
      };
    })
);
</script>

<template>
  <div class="flex gap-4" v-if="links && links.length">
    <UTooltip v-for="item in linksComputed" :text="item.name">
      <a
        class="flex flex-col items-center gap-1"
        :href="item.linkCreator(item.value)"
        target="_blank"
      >
        <UIcon :name="item.icon" :class="['w-6 h-6', item.iconClassNames]" />
      </a>
    </UTooltip>
  </div>
</template>

<style scoped></style>
