<script lang="ts" setup>
const url = useRequestURL();
const { state } = useAuthStore();

const { copy } = useCopy();

const copyLink = () => {
  if (!state.page) return;
  copy(`${url.origin}/${state.page?.path}/obs`);
};
</script>

<template>
  <div>
    <PageTitle title="OBS" desciption="OBS widget and settings." />
    <div class="flex flex-col items-start gap-2">
      <!-- <span class="font-bold text-lg">Get page</span> -->
      <span>
        To use XMRChat on OBS, copy the link to OBS page and add it on "Browser"
        of OBS Sources.
      </span>
      <UButton icon="i-heroicons-document-duplicate" @click="copyLink">
        Copy OBS Page Link
      </UButton>
    </div>
    <UDivider class="my-6" />
    <div class="font-bold text-lg mb-4">OBS Page Settings</div>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
        <div>
          <UToggle></UToggle>
        </div>
        <span class="font-bold cols">Keep Messages</span>
        <span></span>
        <span class="text-pale text-sm">
          When active, keeps the latest tips on the screen, otherwhise each
          message is displayed for a period of time.
        </span>
      </div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
        <div>
          <UToggle></UToggle>
        </div>
        <span class="font-bold cols">Play Sound</span>
        <span></span>
        <span class="text-pale text-sm">
          Plays a sound on the OBS page when new tip appears.
        </span>
      </div>
    </div>
    <div class="mt-6">
      <UButton>Save Changes</UButton>
    </div>
  </div>
</template>

<style scoped></style>
