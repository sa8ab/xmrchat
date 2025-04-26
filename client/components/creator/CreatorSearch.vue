<script lang="ts" setup>
const route = useRoute();
const state: { search?: string } = reactive({
  search: undefined,
});
const { t } = useI18n();

useFilter({
  queryToData: () =>
    (state.search = (route.query.search as string) || undefined),
});

async function onSubmit() {
  await navigateTo({
    query: {
      search: state.search,
    },
  });
}

const resetSearch = () => {
  state.search = undefined;
  onSubmit();
};
</script>

<template>
  <div class="search-box">
    <UForm :state="state" class="pt-6 flex gap-2" @submit="onSubmit">
      <UFormGroup name="search">
        <UInput
          v-model="state.search"
          size="sm"
          :placeholder="t('typePageName')"
          autocomplete="off"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="!!state.search"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="resetSearch"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UButton type="submit" variant="solid" size="sm">
        {{ t("search") }}
      </UButton>
    </UForm>
  </div>
</template>

<style lang="scss">
.search-box {
  form {
    @apply flex;
  }

  margin: 0 auto;
  @apply flex items-center;
}
</style>
