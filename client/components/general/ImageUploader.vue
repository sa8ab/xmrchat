<script lang="ts" setup>
import type { AxiosProgressEvent } from "axios";
import type { Numberic, UploadedFile } from "~/types";
import { UploadSlug } from "~/types/enums";

const { uploadImage: uploadApi } = useServices();
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

const handleChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files.length) {
    return;
  }

  const formData = new FormData();

  const file = files[0];
  formData.append("image", file);

  staged.value = URL.createObjectURL(file);

  isUploading.value = true;
  try {
    controller.value = new AbortController();
    const res = await uploadApi(formData, UploadSlug.PAGE_LOGO, {
      signal: controller.value?.signal,
      onUploadProgress: (e: AxiosProgressEvent) => {
        const percentCompleted = Math.floor((e.loaded * 100) / (e.total || 0));
        progress.value = percentCompleted;
      },
    });
    console.log(res);

    emit("upload", res.file);
  } catch (e) {
    console.log(e);
  } finally {
    isUploading.value = false;
    progress.value = 0;
  }
};
</script>

<template>
  <div class="image-uploader">
    <div class="flex gap-2 flex-col">
      <label class="relative">
        <UButton class="button" size="lg" variant="outline" tabindex="-1" block>
          <input
            type="file"
            @change="handleChange"
            accept="image/*"
            v-bind="$attrs"
          />
          <span>{{ t("clickToUpload") }}</span>
        </UButton>
      </label>
      <UProgress v-if="isUploading" :value="progress" />
      <!-- <Progress v-if="isUploading" :percent="progress" /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  @apply absolute cursor-pointer top-0 left-0 opacity-0 w-full h-full;
}
.image-uploader {
  @apply flex flex-col gap-2;
}
</style>
