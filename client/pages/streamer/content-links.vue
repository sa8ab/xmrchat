<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { ContentLinkPlatformEnum } from "~/types/enums";

interface State {
  form: {
    name?: string;
    searchTerms?: string;
    links: Record<
      ContentLinkPlatformEnum,
      { platform?: ContentLinkPlatformEnum; value?: string }
    >;
  };
  saving: boolean;
  saveError?: string;
}

const { getMyLinks: getMyLinksReq, updateLinks } = useServices();
const { url, notUrl } = useValidations();
const toast = useToast();
const { getContentLink } = useConstants();
const { t } = useI18n();

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
      tiktok: {},
      odysee: {},
      "podcast-rss": {},
      instagram: {},
      telegram: {},
      nostr: {},
      xmrbazaar: {},
      kick: {},
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
      title: t("changesAreSaved"),
    });
  } catch (error) {
    state.saveError = getErrorMessage(error);
  } finally {
    state.saving = false;
  }
};

const rules = computed(() => {
  const notUrlWithMessage = helpers.withMessage(t("notUrlWithMessage"), notUrl);
  const { WEBSITE, PODCAST_RSS, ...rest } = ContentLinkPlatformEnum;

  const notUrls: Record<string, any> = {};
  Object.values(rest).forEach((nUrl) => {
    notUrls[nUrl] = { value: { notUrlWithMessage } };
  });

  return {
    [WEBSITE]: { value: { url } },
    [PODCAST_RSS]: { value: { url } },
    ...notUrls,
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
      :title="t('contentLinks')"
      :description="t('contentLinksDescription')"
    />

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup :label="t('brandName')" :help="t('brandNameHelp')">
        <UInput v-model="state.form.name" />
      </UFormGroup>
      <UFormGroup :label="t('searchTerms')" :help="t('searchTermsHelp')">
        <UInput v-model="state.form.searchTerms" />
      </UFormGroup>
    </div>

    <h3 class="font-bold mt-8">{{ t("contentLinks") }}</h3>
    <p class="text-sm text-pale pt-1 mb-4">
      {{ t("contentLinksSecondDescription") }}
    </p>

    <div
      class="grid md:grid-cols-2 md:grid-flow-col gap-4"
      :style="`grid-template-rows: repeat(${
        CONTENT_LINKS_LIST.length / 2
      }, 1fr)`"
    >
      <!-- <template
        v-for="p in CONTENT_LINKS_LIST.slice(0, CONTENT_LINKS_LIST.length / 2)"
      >
        <pre>{{ p }}</pre>
      </template> -->
      <UFormGroup
        label="Website"
        v-for="p in CONTENT_LINKS_LIST"
        :error="getValidationAttrs(`${p}.value`).error"
      >
        <template #label>
          <span class="flex items-center gap-1.5">
            <UIcon
              :name="getContentLink(p).icon"
              :class="['w-[16px] h-[16px]', getContentLink(p).colorClassName]"
            />
            <span>{{ getContentLink(p).inputLabel }}</span>
          </span>
        </template>
        <UInput
          v-model="state.form.links[p].value"
          @blur="getValidationAttrs(`${p}.value`).onBlur"
        />
      </UFormGroup>
    </div>

    <UAlert
      v-if="state.saveError"
      class="mt-4"
      :title="t('errorSavingChanges')"
      color="red"
      variant="subtle"
      :description="state.saveError"
    ></UAlert>

    <div class="mt-4">
      <UButton :loading="state.saving" @click="save">{{
        t("saveChanges")
      }}</UButton>
    </div>
  </div>
</template>

<style scoped></style>
