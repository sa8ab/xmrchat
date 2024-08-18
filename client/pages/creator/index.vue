<script lang="ts" setup>
const { getCreators } = useServices();

const route = useRoute();

const { status, refresh, error, data } = useLazyAsyncData(
  "creators",
  () =>
    getCreators({
      limit,
      offset: offset.value,
      // search: '' TODO: Push search value to query and read it here.
    }),
  { server: false }
);

const { page, offset, limit } = useFilter({
  getAll: () => refresh(),
});
</script>

<template>
  <div>
    <div class="inner">
      <h1>Search Creators</h1>
      <p>Search creators description</p>
      <div>
        An small form with one input and a button in the end, clicking button
        starts searching.
      </div>
      <div>Put list here</div>
      <UPagination v-model="page" :total="100" class="mt-4 justify-end" />
    </div>
  </div>
</template>

<style scoped></style>
