<script lang="ts" setup>
import type { ContentLink, ContentLinkFull } from "~/types";
import { ContentLinkPlatformEnum, LiveStreamPlatformEnum } from "~/types/enums";

const props = defineProps<{
  links?: ContentLink[];
  livePlatforms?: LiveStreamPlatformEnum[];
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

const isLive = (platform: ContentLinkPlatformEnum) => {
  return props.livePlatforms?.includes(
    platform as unknown as LiveStreamPlatformEnum
  );
};

const getName = (
  item: ContentLinkFull & { platform: ContentLinkPlatformEnum }
) => {
  const live = isLive(item.platform);
  return live ? `${item.name} ( Live )` : item.name;
};
</script>

<template>
  <div class="flex gap-4 flex-wrap" v-if="links && links.length">
    <UTooltip v-for="item in linksComputed" :text="getName(item)">
      <NuxtLink
        v-if="item.linkCreator"
        class="flex flex-col items-center justify-center gap-1"
        :href="item.linkCreator(item.value)"
        target="_blank"
      >
        <LiveIndicator
          v-if="isLive(item.platform)"
          class="absolute top-0 right-0 z-10"
        />
        <UIcon
          :name="item.icon"
          :class="['w-6 h-6', item.colorClassName, item.iconClassName]"
        />
        <span class="sr-only">{{ item.name }}</span>
      </NuxtLink>
      <UButton
        v-else
        class="flex flex-col items-center justify-center gap-1"
        square
        :padded="false"
        variant="link"
        @click="handleLinkClick(item)"
      >
        <LiveIndicator
          v-if="isLive(item.platform)"
          class="absolute top-0 right-0 z-10"
        />
        <UIcon
          :name="item.icon"
          :class="['w-6 h-6', item.colorClassName, item.iconClassName]"
        />
        <span class="sr-only">{{ item.name }}</span>
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
