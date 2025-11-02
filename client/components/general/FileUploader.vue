<script lang="ts" setup>
import type { AxiosProgressEvent } from "axios";
import type { UploadedFile } from "~/types";
import { UploadSlug } from "~/types/enums";

const props = defineProps<{
  slug: UploadSlug;
  accept?: string;
}>();

const { axios } = useApp();
const { t } = useI18n();

defineOptions({
  inheritAttrs: false,
});

const staged = ref<string>();

const emit = defineEmits<{
  upload: [UploadedFile];
}>();

const isUploading = ref<boolean>(false);
const progress = ref<number>(0);
const controller = ref<AbortController | undefined>();

const handleChange = async (files: FileList) => {
  if (!files?.length) return;
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  isUploading.value = true;
  try {
    controller.value = new AbortController();
    const { data } = await axios.post(`/upload/${props.slug}`, formData, {
      signal: controller.value?.signal,
      onUploadProgress: (e: AxiosProgressEvent) => {
        const percentCompleted = Math.floor((e.loaded * 100) / (e.total || 0));
        progress.value = percentCompleted;
      },
    });
    console.log(data);

    emit("upload", data.files[0]);
  } catch (e) {
    console.log(e);
  } finally {
    isUploading.value = false;
    progress.value = 0;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 flex-col">
      <UInput
        type="file"
        v-bind="$attrs"
        @change="handleChange"
        :accept="accept"
      />
      <UProgress v-if="isUploading" :value="progress" />
      <!-- <Progress v-if="isUploading" :percent="progress" /> -->
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
