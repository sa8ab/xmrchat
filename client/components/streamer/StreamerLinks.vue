<script lang="ts" setup>
import type { ContentLink, ContentLinkFull } from "~/types";
import { ContentLinkPlatformEnum } from "~/types/enums";

const props = defineProps<{
  links?: ContentLink[];
}>();

const { getContentLink } = useConstants();

const nostrActive = ref(false);

const linksComputed = computed(() =>
  props.links
    ?.filter((l) => !!l.value)
    .map((l) => {
      return {
        ...getContentLink(l.platform),
        value: l.value,
        platform: l.platform,
      };
    })
    .toSorted((a, b) => {
      const indexOfA = CONTENT_LINKS_LIST.indexOf(a.platform);
      const indexOfB = CONTENT_LINKS_LIST.indexOf(b.platform);

      return indexOfA - indexOfB;
    })
);

const handleLinkClick = (
  item: ContentLinkFull & { platform: ContentLinkPlatformEnum }
) => {
  if (item.platform === ContentLinkPlatformEnum.NOSTR) {
    nostrActive.value = true;
  }
};
</script>

<template>
  <div class="flex gap-4 flex-wrap" v-if="links && links.length">
    <UTooltip v-for="item in linksComputed" :text="item.name">
      <NuxtLink
        v-if="item.linkCreator"
        class="flex flex-col items-center justify-center gap-1"
        :href="item.linkCreator(item.value)"
        target="_blank"
      >
        <UIcon
          :name="item.icon"
          :class="['w-6 h-6', item.colorClassName, item.iconClassName]"
        />
      </NuxtLink>
      <UButton
        v-else
        class="flex flex-col items-center justify-center gap-1"
        square
        :padded="false"
        variant="link"
        @click="handleLinkClick(item)"
      >
        <UIcon
          :name="item.icon"
          :class="['w-6 h-6', item.colorClassName, item.iconClassName]"
        />
      </UButton>
    </UTooltip>
    <NostrAddressModal
      v-model="nostrActive"
      :nostr="
        linksComputed?.find(
          ({ platform }) => platform === ContentLinkPlatformEnum.NOSTR
        )?.value
      "
    />
  </div>
</template>

<style scoped></style>
