<script lang="ts" setup>
import { PageLinkPLatform } from "~/types/enums";

interface State {
  form: {
    name?: string;
    searchTerms?: string;
    links: Record<
      PageLinkPLatform,
      { platform?: PageLinkPLatform; value?: string }
    >;
  };
}

const { getMyLinks: getMyLinksReq } = useServices();
const { data } = useLazyAsyncData(
  async () => {
    const res = await getMyLinksReq();

    const { links, ...rest } = res;

    state.form = {
      // @ts-ignore
      links: arrayToObject(links, "platform"),
      ...rest,
    };

    return {};
  },
  { server: false }
);

const state = reactive<State>({
  form: {
    links: {
      rumble: {},
      substack: {},
      twitch: {},
      x: {},
      website: {},
      youtube: {},
    },
    name: undefined,
    searchTerms: undefined,
  },
});
</script>

<template>
  <div>
    <PageTitle
      title="Content Links"
      description="Name, Search Terms and Content Links"
    />

    <div class="grid grid-cols-2 gap-4">
      <UFormGroup
        label="Page Name"
        help="Name of the page. It can be different from slug."
      >
        <UInput v-model="state.form.name" />
      </UFormGroup>
      <UFormGroup
        label="Search Terms"
        help="Keywords or description that help easier search on creator search ( For public pages )."
      >
        <UInput v-model="state.form.searchTerms" />
      </UFormGroup>
    </div>

    <h3 class="font-bold mt-8">Content Links</h3>
    <p class="text-sm text-pale pt-1 mb-4">
      Links to your social pages or websites. To reset a value leave field
      empty.
    </p>

    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Website" v-for="platform in PageLinkPLatform">
        <template #label>
          <span class="flex items-center gap-1">
            <UIcon
              :name="PAGE_LINKS[platform].icon"
              :class="[
                'w-[16px] h-[16px]',
                PAGE_LINKS[platform].colorClassname,
              ]"
            />
            <span>{{ PAGE_LINKS[platform].inputLabel }}</span>
          </span>
        </template>
        <UInput v-model="state.form.links[platform].value" />
      </UFormGroup>
    </div>
  </div>
</template>

<style scoped></style>
