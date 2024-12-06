<script lang="ts" setup>
const { toIndex } = useRouteLocation();

useHead({
  title: "Edit Page",
});

const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: toIndex(),
  },
  {
    label: "Edit Page",
    icon: "i-heroicons-folder-plus-solid",
  },
];
</script>

<template>
  <div>
    <div class="inner">
      <div class="flex flex-col">
        <!-- <UBreadcrumb :links="links" /> -->

        <PageTitle title="Edit Page" description="Customize your tip page." />
      </div>
      <StreamerModifyForm :editable="true" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
