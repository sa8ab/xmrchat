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
  saving: boolean;
  saveError?: string;
}

const { getMyLinks: getMyLinksReq, updateLinks } = useServices();
const toast = useToast();

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
  saving: false,
  saveError: undefined,
});

const save = async () => {
  try {
    state.saveError = undefined;
    state.saving = true;
    await updateLinks({
      name: state.form.name,
      searchTerms: state.form.searchTerms,
      links: Object.values(state.form.links),
    });

    toast.add({
      title: "Changes are saved.",
    });
  } catch (error) {
    state.saveError = getErrorMessage(error);
  } finally {
    state.saving = false;
  }
};
</script>

<template>
  <div>
    <PageTitle
      title="Content Links"
      description="Name, Search Terms and Content Links"
    />

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup
        label="Brand Name"
        help="Name of the brand/content. It can be different from slug."
      >
        <UInput v-model="state.form.name" />
      </UFormGroup>
      <UFormGroup
        label="Search Terms"
        help="Creator search will return results based on page slug, name, and keywords in this list."
      >
        <UInput v-model="state.form.searchTerms" />
      </UFormGroup>
    </div>

    <h3 class="font-bold mt-8">Content Links</h3>
    <p class="text-sm text-pale pt-1 mb-4">
      Links to your social pages or websites. To reset a value leave the field
      empty.
    </p>

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="Website" v-for="platform in PageLinkPLatform">
        <template #label>
          <span class="flex items-center gap-1.5">
            <UIcon
              :name="PAGE_LINKS[platform].icon"
              :class="[
                'w-[16px] h-[16px]',
                PAGE_LINKS[platform].colorClassName,
              ]"
            />
            <span>{{ PAGE_LINKS[platform].inputLabel }}</span>
          </span>
        </template>
        <UInput v-model="state.form.links[platform].value" />
      </UFormGroup>
    </div>

    <UAlert
      v-if="state.saveError"
      class="mt-4"
      title="Error saving changes."
      color="red"
      variant="subtle"
      :description="state.saveError"
    ></UAlert>

    <div class="mt-4">
      <UButton :loading="state.saving" @click="save">Save Changes</UButton>
    </div>
  </div>
</template>

<style scoped></style>
