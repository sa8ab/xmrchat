<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
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
const { url, notUrl } = useValidations();
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
  const valid = await v.value.$validate();
  if (!valid) return;
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

const rules = computed(() => {
  const notUrlWithMessage = helpers.withMessage(
    "Only enter the name, not the full link.",
    notUrl
  );
  return {
    [PageLinkPLatform.WEBSITE]: {
      value: { url },
    },
    [PageLinkPLatform.X]: { value: { notUrlWithMessage } },
    [PageLinkPLatform.YOUTUBE]: { value: { notUrlWithMessage } },
    [PageLinkPLatform.TWITCH]: { value: { notUrlWithMessage } },
    [PageLinkPLatform.SUBSTACK]: { value: { notUrlWithMessage } },
    [PageLinkPLatform.RUMBLE]: { value: { notUrlWithMessage } },
  };
});

const v = useVuelidate(
  rules,
  computed(() => state.form.links)
);

const { getValidationAttrs } = useValidations(v);
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
      <UFormGroup
        label="Website"
        v-for="platform in PageLinkPLatform"
        :error="getValidationAttrs(`${platform}.value`).error"
      >
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
        <UInput
          v-model="state.form.links[platform].value"
          @blur="getValidationAttrs(`${platform}.value`).onBlur"
        />
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
