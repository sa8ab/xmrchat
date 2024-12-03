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
const { data } = useLazyAsyncData(async () => {
  const res = await getMyLinksReq();

  const { links, ...rest } = res;

  state.form = {
    // @ts-ignore
    links: arrayToObject(links, "platform"),
    ...rest,
  };

  return {};
});

const state = reactive<State>({
  form: {
    links: {
      rumble: {},
      substack: {},
      twitch: {},
      twitter: {},
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

    <pre>{{ state.form }}</pre>
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
    <p class="text-sm text-pale pt-1">
      Links to your social pages or websites. To reset a value leave field
      empty.
    </p>

    <div class="grid grid-cols-2 gap-4"></div>
  </div>
</template>

<style scoped></style>
