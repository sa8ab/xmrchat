<script lang="ts" setup>
import type { ContentLink } from "~/types";

const props = defineProps<{
  links?: ContentLink[];
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
      <NuxtLink
        class="flex flex-col items-center justify-center gap-1"
        :href="item.linkCreator(item.value)"
        target="_blank"
      >
        <UIcon
          :name="item.icon"
          :class="['w-6 h-6', item.colorClassName, item.iconClassName]"
        />
      </NuxtLink>
    </UTooltip>
  </div>
</template>

<style scoped></style>
